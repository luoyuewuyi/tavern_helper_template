#!/usr/bin/env python3
"""Validate a Tavo CCv3 project and detect SillyTavern runtime contamination."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any


@dataclass
class Finding:
    level: str
    code: str
    area: str
    message: str
    file: str | None = None


FORBIDDEN = {
    "ST-MVU": re.compile(r"\b(?:MagVarUpdate|MVU|Mvu)\b|\[(?:initvar|mvu_update)\]|<UpdateVariable>|<JSONPatch>", re.I),
    "ST-HELPER": re.compile(r"\b(?:TavernHelper|getVariables|updateVariablesWith|triggerSlash|registerMvuSchema)\s*\(", re.I),
    "ST-SYNC": re.compile(r"\bTavernSync\b|\btavern_sync(?:\.mjs|\.yaml)?\b", re.I),
    "ST-DOM": re.compile(r"\$\(['\"]body['\"]\)\.load\s*\(|window\.parent|#send_textarea|#send_but", re.I),
    "ST-IFRAME": re.compile(r"<iframe\b|testingcf\.jsdelivr\.net/gh/", re.I),
}

VALID_SCOPES = {"chat", "global", "message"}
VALID_TYPES = {"string", "number", "boolean", "array", "object", "null"}
VALID_PLACEMENTS = {"user", "char", "reasoning", "lorebook"}
VALID_TIMINGS = {"display", "send", "sendAndDisplay", "receive", "editAndReceive"}
VALID_SUBSTITUTIONS = {"none", "raw", "escaped"}
VALID_RENDER_TARGETS = {"first_mes_append", "regex_replace"}
VALID_LORE_POSITIONS = {"before_char", "after_char"}
PORTABLE_RENDER_TIMINGS = {"display", "send", "sendAndDisplay"}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise ValueError(f"缺少文件：{path}") from error
    except json.JSONDecodeError as error:
        raise ValueError(f"JSON 解析失败 {path}:{error.lineno}:{error.colno} {error.msg}") from error


def json_type(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, (int, float)):
        return "number"
    if isinstance(value, str):
        return "string"
    if isinstance(value, list):
        return "array"
    if isinstance(value, dict):
        return "object"
    return type(value).__name__


def regex_shape_error(value: Any) -> str | None:
    if not isinstance(value, str) or not value:
        return "findRegex 必须是非空字符串"
    if not value.startswith("/"):
        return None
    last = value.rfind("/")
    if last <= 0:
        return "正则字面量缺少结束 /"
    flags = value[last + 1:]
    if any(flag not in "dgimsuvy" for flag in flags) or len(set(flags)) != len(flags):
        return f"JavaScript 正则 flags 非法：{flags}"
    return None


def validate_card(project: Path, findings: list[Finding]) -> dict[str, Any] | None:
    card_path = project / "card.json"
    try:
        card = load_json(card_path)
    except ValueError as error:
        findings.append(Finding("error", "CARD-READ", "CCv3", str(error), str(card_path)))
        return None
    if not isinstance(card, dict):
        findings.append(Finding("error", "CARD-OBJECT", "CCv3", "card.json 顶层必须是对象", str(card_path)))
        return None
    if card.get("spec") != "chara_card_v3":
        findings.append(Finding("error", "CARD-SPEC", "CCv3", "spec 必须为 chara_card_v3", str(card_path)))
    if card.get("spec_version") != "3.0":
        findings.append(Finding("warning", "CARD-VERSION", "CCv3", "当前工具以 CCv3 3.0 为构建目标", str(card_path)))
    data = card.get("data")
    if not isinstance(data, dict):
        findings.append(Finding("error", "CARD-DATA", "CCv3", "data 必须是对象", str(card_path)))
        return card
    required_strings = (
        "name", "description", "personality", "scenario", "first_mes", "mes_example",
        "creator_notes", "system_prompt", "post_history_instructions", "creator", "character_version",
    )
    for key in required_strings:
        if not isinstance(data.get(key), str):
            findings.append(Finding("error", "CARD-TYPE", "CCv3", f"data.{key} 必须是字符串", str(card_path)))
    if not str(data.get("name", "")).strip():
        findings.append(Finding("error", "CARD-NAME", "角色", "角色名不能为空", str(card_path)))
    if not str(data.get("first_mes", "")).strip():
        findings.append(Finding("error", "CARD-FIRST-MES", "开场", "主开场 first_mes 不能为空", str(card_path)))
    for key in ("alternate_greetings", "group_only_greetings", "tags"):
        if not isinstance(data.get(key), list) or not all(isinstance(item, str) for item in data.get(key, [])):
            findings.append(Finding("error", "CARD-ARRAY", "CCv3", f"data.{key} 必须是字符串数组", str(card_path)))
    if not isinstance(data.get("extensions"), dict):
        findings.append(Finding("error", "CARD-EXT", "CCv3", "data.extensions 必须是对象", str(card_path)))
    validate_lorebook(data.get("character_book"), card_path, findings)
    validate_embedded_regex(data.get("extensions"), card_path, findings)
    repeated_fields = ("description", "personality", "scenario", "system_prompt", "post_history_instructions", "mes_example")
    for key in repeated_fields:
        if "{{setvar::" in str(data.get(key, "")) or "{{setglobalvar::" in str(data.get(key, "")):
            findings.append(Finding(
                "error", "VAR-REINIT", "变量",
                f"data.{key} 会重复进入提示词，不能放无条件 setvar/setglobalvar 初始化",
                str(card_path),
            ))
    return card


def validate_lorebook(book: Any, path: Path, findings: list[Finding]) -> None:
    if book is None:
        return
    if not isinstance(book, dict) or not isinstance(book.get("entries"), list):
        findings.append(Finding("error", "LORE-OBJECT", "世界书", "character_book 必须是含 entries 数组的对象", str(path)))
        return
    seen: set[str] = set()
    for index, entry in enumerate(book["entries"]):
        label = f"character_book.entries[{index}]"
        if not isinstance(entry, dict):
            findings.append(Finding("error", "LORE-ENTRY", "世界书", f"{label} 必须是对象", str(path)))
            continue
        identifier = str(entry.get("id", entry.get("identifier", "")))
        if identifier:
            if identifier in seen:
                findings.append(Finding("error", "LORE-ID", "世界书", f"{label} 的 ID 重复：{identifier}", str(path)))
            seen.add(identifier)
        else:
            findings.append(Finding("warning", "LORE-ID-MISSING", "世界书", f"{label} 建议提供稳定 id／identifier", str(path)))
        if not str(entry.get("name", entry.get("comment", ""))).strip():
            findings.append(Finding("warning", "LORE-NAME", "世界书", f"{label} 建议提供名称，便于 Tavo 回读和维护", str(path)))
        if not isinstance(entry.get("content"), str) or not entry.get("content", "").strip():
            findings.append(Finding("error", "LORE-CONTENT", "世界书", f"{label}.content 不能为空", str(path)))
        if entry.get("constant") is not True:
            keys = entry.get("keys")
            if not isinstance(keys, list) or not any(isinstance(key, str) and key.strip() for key in keys):
                findings.append(Finding("error", "LORE-KEYS", "世界书", f"{label} 非常驻时必须有 keys", str(path)))
        if "position" in entry and entry.get("position") not in VALID_LORE_POSITIONS:
            findings.append(Finding("error", "LORE-POSITION", "世界书", f"{label}.position 必须为 before_char 或 after_char", str(path)))
        if "secondary_keys" in entry and not isinstance(entry.get("secondary_keys"), list):
            findings.append(Finding("error", "LORE-SECONDARY", "世界书", f"{label}.secondary_keys 必须是数组", str(path)))
        content = str(entry.get("content", ""))
        if "{{setvar::" in content or "{{setglobalvar::" in content:
            findings.append(Finding(
                "error", "LORE-REINIT", "变量",
                f"{label} 不能直接执行 setvar/setglobalvar；世界书会重复触发，变量初始化和更新应放在可证明幂等的宏入口、EJS 或 TavoJS",
                str(path),
            ))


def validate_embedded_regex(extensions: Any, path: Path, findings: list[Finding]) -> None:
    if not isinstance(extensions, dict) or "regex_scripts" not in extensions:
        return
    scripts = extensions["regex_scripts"]
    if not isinstance(scripts, list):
        findings.append(Finding("error", "REGEX-EMBED", "正则", "extensions.regex_scripts 必须是兼容规则数组", str(path)))
        return
    for index, entry in enumerate(scripts):
        if not isinstance(entry, dict):
            findings.append(Finding("error", "REGEX-ENTRY", "正则", f"regex_scripts[{index}] 必须是对象", str(path)))
            continue
        for key in ("scriptName", "findRegex", "replaceString"):
            if not isinstance(entry.get(key), str):
                findings.append(Finding("error", "REGEX-LEGACY-TYPE", "正则", f"regex_scripts[{index}].{key} 必须是字符串", str(path)))
        shape_error = regex_shape_error(entry.get("findRegex"))
        if shape_error:
            findings.append(Finding("error", "REGEX-LEGACY-SHAPE", "正则", f"regex_scripts[{index}]: {shape_error}", str(path)))
        if not isinstance(entry.get("placement"), list):
            findings.append(Finding("error", "REGEX-LEGACY-PLACE", "正则", f"regex_scripts[{index}].placement 必须是数组", str(path)))


def greeting_values(card: dict[str, Any] | None) -> list[str]:
    if not card or not isinstance(card.get("data"), dict):
        return []
    data = card["data"]
    values = [str(data.get("first_mes", ""))]
    values.extend(str(value) for value in data.get("alternate_greetings", []) if isinstance(value, str))
    values.extend(str(value) for value in data.get("group_only_greetings", []) if isinstance(value, str))
    return values


def validate_variables(project: Path, card: dict[str, Any] | None, findings: list[Finding]) -> None:
    path = project / "tavo" / "variables.json"
    try:
        payload = load_json(path)
    except ValueError as error:
        findings.append(Finding("error", "VAR-READ", "变量", str(error), str(path)))
        return
    if not isinstance(payload, dict) or not isinstance(payload.get("variables"), list):
        findings.append(Finding("error", "VAR-SHAPE", "变量", "variables.json 必须包含 variables 数组", str(path)))
        return
    init_version = payload.get("initialization_version")
    if not isinstance(init_version, int) or init_version < 1:
        findings.append(Finding("error", "VAR-INIT-VERSION", "变量", "initialization_version 必须是正整数", str(path)))
    each_greeting = greeting_values(card)
    seen: set[tuple[str, str]] = set()
    for index, variable in enumerate(payload["variables"]):
        label = f"variables[{index}]"
        if not isinstance(variable, dict):
            findings.append(Finding("error", "VAR-ENTRY", "变量", f"{label} 必须是对象", str(path)))
            continue
        name = variable.get("name")
        scope = variable.get("scope", "chat")
        declared = variable.get("type")
        if not isinstance(name, str) or not name.strip():
            findings.append(Finding("error", "VAR-NAME", "变量", f"{label}.name 不能为空", str(path)))
        if scope not in VALID_SCOPES:
            findings.append(Finding("error", "VAR-SCOPE", "变量", f"{label}.scope 必须是 chat/global/message", str(path)))
        key = (str(scope), str(name))
        if key in seen:
            findings.append(Finding("error", "VAR-DUP", "变量", f"变量重复：{scope}:{name}", str(path)))
        seen.add(key)
        if declared not in VALID_TYPES:
            findings.append(Finding("error", "VAR-TYPE", "变量", f"{label}.type 非法：{declared}", str(path)))
        raw_init = variable.get("initialization", {})
        init_mode = raw_init.get("mode") if isinstance(raw_init, dict) else None
        if "initial" not in variable and init_mode != "none":
            findings.append(Finding("error", "VAR-INITIAL", "变量", f"{label} 使用初始化时必须提供 initial", str(path)))
        if "initial" in variable and declared in VALID_TYPES and json_type(variable["initial"]) != declared:
            findings.append(Finding("error", "VAR-INITIAL-TYPE", "变量", f"{label}.initial 类型与 {declared} 不一致", str(path)))
        init = raw_init
        if not isinstance(init, dict) or init.get("mode") not in {"none", "macro", "ejs", "tavojs"}:
            findings.append(Finding("error", "VAR-INIT", "变量", f"{label}.initialization.mode 必须是 none/macro/ejs/tavojs", str(path)))
        elif init.get("mode") != "none" and init.get("idempotent") is not True:
            findings.append(Finding("error", "VAR-IDEMPOTENT", "变量", f"{label} 初始化必须显式 idempotent: true", str(path)))
        if scope == "message" and init.get("mode") in {"macro", "ejs"}:
            findings.append(Finding("error", "VAR-MESSAGE-INIT", "变量", f"{label} 的 message scope 应由 TavoJS 按稳定消息 ID 处理", str(path)))
        if init.get("mode") in {"macro", "ejs"} and not isinstance(init.get("entry"), str):
            findings.append(Finding("error", "VAR-INIT-ENTRY", "变量", f"{label} 的宏／EJS 初始化必须写明 entry", str(path)))
        if init.get("mode") == "macro":
            macro = "setglobalvar" if scope == "global" else "setvar"
            marker = f"{{{{{macro}::{name}::"
            if not each_greeting or any(marker not in greeting for greeting in each_greeting):
                findings.append(Finding("error", "VAR-MACRO-MISSING", "变量", f"{label} 声明宏初始化，但并非每个可选开场都含对应 {macro}", str(path)))
        if init.get("mode") == "ejs" and (
            not each_greeting or any("<%" not in greeting or str(name) not in greeting for greeting in each_greeting)
        ):
            findings.append(Finding("error", "VAR-EJS-MISSING", "变量", f"{label} 声明 EJS 初始化，但并非每个可选开场都含对应逻辑", str(path)))
        for field in ("description", "writer", "readers", "reset"):
            if field not in variable or variable.get(field) in ("", [], None):
                findings.append(Finding("warning", "VAR-DOC", "变量", f"{label} 建议补全 {field}，避免 AI 不知道谁负责读写和重置", str(path)))


def validate_rendering(project: Path, findings: list[Finding]) -> None:
    root = project / "tavo" / "rendering"
    config_path = root / "config.json"
    if not root.exists():
        return
    if not config_path.exists():
        findings.append(Finding("warning", "RENDER-DISABLED", "渲染", "存在旧式 rendering 目录但没有 config.json；构建时按未启用处理，不会把这些文件伪装成已接入界面", str(root)))
        return
    try:
        config = load_json(config_path)
    except ValueError as error:
        findings.append(Finding("error", "RENDER-CONFIG", "渲染", str(error), str(config_path)))
        return
    if not isinstance(config, dict) or not isinstance(config.get("enabled"), bool):
        findings.append(Finding("error", "RENDER-SHAPE", "渲染", "config.json 必须包含布尔 enabled", str(config_path)))
        return
    if not config["enabled"]:
        return
    target = config.get("target")
    if target not in VALID_RENDER_TARGETS:
        findings.append(Finding("error", "RENDER-TARGET", "渲染", "启用渲染时 target 必须为 first_mes_append 或 regex_replace", str(config_path)))
    fallback = config.get("plain_text_fallback")
    if not isinstance(fallback, str) or not fallback.strip():
        findings.append(Finding("error", "RENDER-FALLBACK", "渲染", "正式渲染必须提供可玩的 plain_text_fallback", str(config_path)))
    if target == "first_mes_append" and not isinstance(config.get("apply_to_all_greetings"), bool):
        findings.append(Finding("error", "RENDER-GREETINGS", "渲染", "first_mes_append 必须显式设置布尔 apply_to_all_greetings；正式状态栏通常应为 true", str(config_path)))

    def read_modules(key: str, fallback_files: list[str], suffix: str, code: str) -> list[str]:
        names = config.get(key, fallback_files)
        if not isinstance(names, list) or not names or any(not isinstance(name, str) or not name.strip() for name in names):
            findings.append(Finding("error", f"{code}-LIST", "渲染", f"{key} 必须是非空文件名数组", str(config_path)))
            return []
        if len(names) != len(set(names)):
            findings.append(Finding("error", f"{code}-DUP", "渲染", f"{key} 不能包含重复文件", str(config_path)))
        contents: list[str] = []
        for name in names:
            path = (root / name).resolve()
            try:
                path.relative_to(root.resolve())
            except ValueError:
                findings.append(Finding("error", f"{code}-PATH", "渲染", f"模块路径越界：{name}", str(config_path)))
                continue
            if path.suffix.lower() != suffix or not path.is_file():
                findings.append(Finding("error", f"{code}-FILE", "渲染", f"缺少 {suffix} 模块：{name}", str(path)))
                continue
            content = path.read_text(encoding="utf-8", errors="ignore")
            if not content.strip():
                findings.append(Finding("error", f"{code}-EMPTY", "渲染", f"模块不能为空：{name}", str(path)))
            contents.append(content)
        return contents

    markup_parts = read_modules("markup_files", ["markup.html"], ".html", "RENDER-MARKUP")
    css_parts = read_modules("style_files", ["styles.css"], ".css", "RENDER-CSS")
    script_parts = read_modules("script_files", ["actions.js"], ".js", "RENDER-JS") if config.get("include_javascript") else []
    markup = "\n".join(markup_parts)
    css = "\n".join(css_parts)
    actions = "\n".join(script_parts)
    if "不要保留此占位注释" in markup:
        findings.append(Finding("error", "RENDER-MARKUP-PLACEHOLDER", "渲染", "启用渲染后必须完成 HTML 模块，不能保留模板占位", str(root)))
    if "不要交付默认表单感的空壳" in css or "不要保留此占位注释" in css:
        findings.append(Finding("error", "RENDER-CSS-PLACEHOLDER", "渲染", "启用渲染后必须完成与题材一致的视觉 token、组件和响应式样式", str(root)))
    if config.get("include_javascript") and ("仅在 config.include_javascript" in actions or "不要保留此占位注释" in actions):
        findings.append(Finding("error", "RENDER-JS-PLACEHOLDER", "渲染", "include_javascript=true 时必须完成状态适配、交互与生命周期模块", str(root)))

    visual_review = config.get("visual_review")
    if not isinstance(visual_review, dict) or visual_review.get("status") not in {"pending", "passed"}:
        findings.append(Finding("error", "RENDER-VISUAL-REVIEW", "渲染", "正式界面必须记录 visual_review.status=pending/passed；静态结构验证不能替代真实画面", str(config_path)))
    elif visual_review.get("status") == "pending":
        findings.append(Finding("warning", "RENDER-VISUAL-PENDING", "渲染", "桌面／移动真实画面尚未验收；可以构建，但不得声称界面已美化完成", str(config_path)))
    else:
        for field in ("desktop_screenshot", "mobile_screenshot"):
            relative = visual_review.get(field)
            if not isinstance(relative, str) or not relative.strip():
                findings.append(Finding("error", "RENDER-VISUAL-EVIDENCE", "渲染", f"visual_review.status=passed 时必须提供 {field}", str(config_path)))
                continue
            screenshot = (project / relative).resolve()
            try:
                screenshot.relative_to(project.resolve())
            except ValueError:
                findings.append(Finding("error", "RENDER-VISUAL-PATH", "渲染", f"截图路径越界：{relative}", str(config_path)))
                continue
            if screenshot.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"} or not screenshot.is_file():
                findings.append(Finding("error", "RENDER-VISUAL-FILE", "渲染", f"截图证据不存在或格式不支持：{relative}", str(screenshot)))
    if target == "regex_replace":
        if not str(config.get("regex_group", "")).strip() or not str(config.get("regex_entry", "")).strip():
            findings.append(Finding("error", "RENDER-REGEX-REF", "渲染", "regex_replace 必须指定 regex_group 和 regex_entry", str(config_path)))
        try:
            regex_payload = load_json(project / "tavo" / "regex.json")
            matches = [entry for group in regex_payload.get("groups", []) if group.get("name") == config.get("regex_group") for entry in group.get("entries", []) if entry.get("name") == config.get("regex_entry")]
            if len(matches) != 1 or "{{TAVO_RENDERING}}" not in str(matches[0].get("replaceString", "")):
                findings.append(Finding("error", "RENDER-REGEX-MARKER", "渲染", "目标正则必须唯一存在且 replaceString 包含 {{TAVO_RENDERING}}", str(project / "tavo" / "regex.json")))
            elif matches[0].get("timing", "display") not in PORTABLE_RENDER_TIMINGS:
                findings.append(Finding("error", "RENDER-REGEX-PORTABLE", "渲染", "渲染目标正则必须可内嵌 CCv3；receive/editAndReceive 只能留在原生 sidecar，不能作为直接导入卡的唯一界面入口", str(project / "tavo" / "regex.json")))
        except ValueError:
            pass


def validate_native_regex(project: Path, findings: list[Finding]) -> None:
    path = project / "tavo" / "regex.json"
    try:
        payload = load_json(path)
    except ValueError as error:
        findings.append(Finding("error", "REGEX-READ", "正则", str(error), str(path)))
        return
    groups = payload.get("groups") if isinstance(payload, dict) else None
    if not isinstance(groups, list):
        findings.append(Finding("error", "REGEX-SHAPE", "正则", "regex.json 必须包含 groups 数组", str(path)))
        return
    for group_index, group in enumerate(groups):
        if not isinstance(group, dict) or not isinstance(group.get("name"), str) or not group.get("name", "").strip():
            findings.append(Finding("error", "REGEX-GROUP", "正则", f"groups[{group_index}] 缺少名称", str(path)))
            continue
        entries = group.get("entries")
        if not isinstance(entries, list):
            findings.append(Finding("error", "REGEX-ENTRIES", "正则", f"groups[{group_index}].entries 必须是数组", str(path)))
            continue
        for entry_index, entry in enumerate(entries):
            label = f"groups[{group_index}].entries[{entry_index}]"
            if not isinstance(entry, dict):
                findings.append(Finding("error", "REGEX-NATIVE", "正则", f"{label} 必须是对象", str(path)))
                continue
            for key in ("name", "findRegex", "replaceString"):
                if not isinstance(entry.get(key), str):
                    findings.append(Finding("error", "REGEX-NATIVE-TYPE", "正则", f"{label}.{key} 必须是字符串", str(path)))
            shape_error = regex_shape_error(entry.get("findRegex"))
            if shape_error:
                findings.append(Finding("error", "REGEX-NATIVE-SHAPE", "正则", f"{label}: {shape_error}", str(path)))
            placements = entry.get("placements", ["char"])
            if not isinstance(placements, list) or not placements or any(item not in VALID_PLACEMENTS for item in placements):
                findings.append(Finding("error", "REGEX-PLACEMENTS", "正则", f"{label}.placements 非法", str(path)))
            if entry.get("timing", "display") not in VALID_TIMINGS:
                findings.append(Finding("error", "REGEX-TIMING", "正则", f"{label}.timing 非法", str(path)))
            if entry.get("substitution", "none") not in VALID_SUBSTITUTIONS:
                findings.append(Finding("error", "REGEX-SUBSTITUTION", "正则", f"{label}.substitution 非法", str(path)))
            if entry.get("timing") in {"receive", "editAndReceive"}:
                findings.append(Finding("warning", "REGEX-SIDECAR", "正则", f"{label} 不能无损内嵌 CCv3，必须随附 Tavo 原生安装", str(path)))


def scan_contamination(project: Path, findings: list[Finding], include_dist: bool = False) -> None:
    sources: list[tuple[Path, str]] = []
    allowed = {".json", ".html", ".css", ".js", ".ts"}
    for path in project.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in allowed:
            continue
        relative = path.relative_to(project)
        if not include_dist and relative.parts and relative.parts[0] == "dist":
            continue
        if path.name == "migration-report.md" or "__pycache__" in relative.parts:
            continue
        sources.append((path, path.read_text(encoding="utf-8", errors="ignore")))
    for path, text in sources:
        for code, pattern in FORBIDDEN.items():
            match = pattern.search(text)
            if match:
                findings.append(Finding("error", code, "平台污染", f"检测到酒馆专属运行时：{match.group(0)[:80]}", str(path)))


def file_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_dist(project: Path, findings: list[Finding]) -> None:
    dist = project / "dist"
    manifest_path = dist / "manifest.json"
    try:
        manifest = load_json(manifest_path)
    except ValueError as error:
        findings.append(Finding("error", "DIST-MANIFEST", "构建产物", str(error), str(manifest_path)))
        return
    outputs = manifest.get("outputs") if isinstance(manifest, dict) else None
    if not isinstance(outputs, dict) or not outputs:
        findings.append(Finding("error", "DIST-OUTPUTS", "构建产物", "manifest.outputs 必须列出全部运行产物哈希", str(manifest_path)))
        return
    for relative, expected in outputs.items():
        path = (dist / relative).resolve()
        try:
            path.relative_to(dist.resolve())
        except ValueError:
            findings.append(Finding("error", "DIST-PATH", "构建产物", f"输出路径越界：{relative}", str(manifest_path)))
            continue
        if not path.is_file():
            findings.append(Finding("error", "DIST-MISSING", "构建产物", f"manifest 文件不存在：{relative}", str(path)))
        elif file_sha256(path) != expected:
            findings.append(Finding("error", "DIST-HASH", "构建产物", f"哈希不匹配：{relative}", str(path)))
    native_groups = manifest.get("native_only_regex_groups") if isinstance(manifest, dict) else None
    single_file_complete = manifest.get("single_file_function_complete") if isinstance(manifest, dict) else None
    if not isinstance(native_groups, int) or not isinstance(single_file_complete, bool) or single_file_complete != (native_groups == 0):
        findings.append(Finding("error", "DIST-COMPLETENESS", "构建产物", "manifest 必须准确区分结构完整 CCv3 与单文件功能完整状态", str(manifest_path)))
    card_name = manifest.get("card_file") if isinstance(manifest, dict) else None
    if not isinstance(card_name, str) or card_name not in outputs:
        findings.append(Finding("error", "DIST-CARD-FILE", "构建产物", "manifest.card_file 必须指向 outputs 中的最终 CCv3 JSON", str(manifest_path)))
        return
    deployment_name = manifest.get("deployment_file") if isinstance(manifest, dict) else None
    if not isinstance(deployment_name, str) or deployment_name not in outputs:
        findings.append(Finding("error", "DIST-DEPLOY-FILE", "构建产物", "manifest.deployment_file 必须指向 outputs 中的 Tavo 部署脚本", str(manifest_path)))
    else:
        deployment_path = dist / deployment_name
        deployment = deployment_path.read_text(encoding="utf-8", errors="ignore") if deployment_path.exists() else ""
        required_markers = (
            "tavo.character.import(card)",
            "tavo.character.get(imported.characterId)",
            "备选开场",
            "世界书关键内容",
            "兼容正则关键字段",
            "TAVO_IMPORT_READBACK_OK",
        )
        if any(marker not in deployment for marker in required_markers):
            findings.append(Finding("error", "DIST-DEPLOY-READBACK", "构建产物", "Tavo 部署脚本缺少导入、按 ID 回读或完成证据", str(deployment_path)))
    card_path = dist / card_name
    try:
        card = load_json(card_path)
    except ValueError as error:
        findings.append(Finding("error", "DIST-CARD-READ", "构建产物", str(error), str(card_path)))
        return
    data = card.get("data") if isinstance(card, dict) else None
    if not isinstance(card, dict) or card.get("spec") != "chara_card_v3" or not isinstance(data, dict):
        findings.append(Finding("error", "DIST-CARD-SPEC", "构建产物", "最终文件不是完整 CCv3", str(card_path)))
        return
    if not str(data.get("name", "")).strip() or not str(data.get("first_mes", "")).strip():
        findings.append(Finding("error", "DIST-CARD-CORE", "构建产物", "最终卡角色名或主开场为空", str(card_path)))
    serialized = json.dumps(card, ensure_ascii=False)
    if "{{TAVO_RENDERING}}" in serialized:
        findings.append(Finding("error", "DIST-RENDER-MARKER", "构建产物", "最终卡仍残留未组装的渲染标记", str(card_path)))
    variables_path = project / "tavo" / "variables.json"
    variables_payload = load_json(variables_path) if variables_path.exists() else {}
    variables = variables_payload.get("variables", []) if isinstance(variables_payload, dict) else []
    if any(isinstance(item, dict) and item.get("initialization", {}).get("mode") == "tavojs" for item in variables):
        greetings = [data.get("first_mes", ""), *data.get("alternate_greetings", []), *data.get("group_only_greetings", [])]
        if any("<!-- TAVO_VARIABLE_INIT -->" not in str(value) for value in greetings):
            findings.append(Finding("error", "DIST-VAR-RUNTIME", "变量", "TavoJS 初始化未进入全部开场运行入口", str(card_path)))
    config_path = project / "tavo" / "rendering" / "config.json"
    if config_path.exists():
        config = load_json(config_path)
        if isinstance(config, dict) and config.get("enabled") and "<!-- TAVO_RENDERING_BUNDLE -->" not in serialized:
            findings.append(Finding("error", "DIST-RENDER-RUNTIME", "渲染", "启用的渲染没有进入最终角色卡运行入口", str(card_path)))
    scan_contamination(dist, findings, include_dist=True)


def validate_project(project: Path) -> tuple[list[Finding], dict[str, Any]]:
    project = project.resolve()
    findings: list[Finding] = []
    if not project.is_dir():
        return [Finding("error", "PROJECT", "项目", f"不是项目目录：{project}")], {}
    card = validate_card(project, findings)
    validate_variables(project, card, findings)
    validate_native_regex(project, findings)
    validate_rendering(project, findings)
    scan_contamination(project, findings)
    card_path = project / "card.json"
    digest = hashlib.sha256(card_path.read_bytes()).hexdigest() if card_path.exists() else None
    summary = {
        "project": str(project),
        "card_sha256": digest,
        "errors": sum(item.level == "error" for item in findings),
        "warnings": sum(item.level == "warning" for item in findings),
    }
    return findings, summary


def main() -> int:
    parser = argparse.ArgumentParser(description="验证 Tavo CCv3 角色卡项目")
    parser.add_argument("project", type=Path)
    parser.add_argument("--json", action="store_true", help="输出机器可读 JSON")
    parser.add_argument("--dist", action="store_true", help="同时独立复核 dist、manifest 和运行入口")
    args = parser.parse_args()
    findings, summary = validate_project(args.project)
    if args.dist:
        validate_dist(args.project.resolve(), findings)
        summary["errors"] = sum(item.level == "error" for item in findings)
        summary["warnings"] = sum(item.level == "warning" for item in findings)
        summary["dist_validated"] = True
    if args.json:
        print(json.dumps({"summary": summary, "findings": [asdict(item) for item in findings]}, ensure_ascii=False, indent=2))
    else:
        for item in findings:
            location = f" [{item.file}]" if item.file else ""
            print(f"{item.level.upper():7} {item.code:20} {item.area}: {item.message}{location}")
        print(json.dumps(summary, ensure_ascii=False))
    return 1 if summary.get("errors", 1) else 0


if __name__ == "__main__":
    raise SystemExit(main())
