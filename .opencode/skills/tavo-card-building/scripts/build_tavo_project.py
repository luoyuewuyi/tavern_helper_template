#!/usr/bin/env python3
"""Build a Tavo project into a CCv3 JSON plus explicit native sidecars."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
import time
from pathlib import Path
from typing import Any

from validate_tavo_project import Finding, load_json, validate_dist, validate_project


INVALID = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
WINDOWS_RESERVED = {
    "CON", "PRN", "AUX", "NUL",
    *(f"COM{number}" for number in range(1, 10)),
    *(f"LPT{number}" for number in range(1, 10)),
}
PLACEMENT_TO_ST = {"user": 1, "char": 2, "lorebook": 5, "reasoning": 6}
SUBSTITUTION_TO_ST = {"none": 0, "raw": 1, "escaped": 2}
PORTABLE_TIMINGS = {"display", "send", "sendAndDisplay"}


def safe_name(value: str) -> str:
    cleaned = (INVALID.sub("_", value).rstrip(" .").strip() or "未命名角色")[:100]
    stem = cleaned.split(".", 1)[0].upper()
    return f"_{cleaned}" if stem in WINDOWS_RESERVED else cleaned


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def script_safe_json(value: Any, *, indent: int | None = None) -> str:
    """Serialize data for an inline/generated JavaScript source safely."""
    return json.dumps(value, ensure_ascii=False, indent=indent).replace("</script", "<\\/script")


def greeting_fields(data: dict[str, Any]) -> list[tuple[str, int | None]]:
    fields: list[tuple[str, int | None]] = [("first_mes", None)]
    fields.extend(("alternate_greetings", index) for index, _ in enumerate(data.get("alternate_greetings", [])))
    fields.extend(("group_only_greetings", index) for index, _ in enumerate(data.get("group_only_greetings", [])))
    return fields


def append_to_greeting(data: dict[str, Any], field: str, index: int | None, suffix: str) -> None:
    if index is None:
        data[field] = f"{data.get(field, '')}{suffix}"
    else:
        data[field][index] = f"{data[field][index]}{suffix}"


def prepend_to_greeting(data: dict[str, Any], field: str, index: int | None, prefix: str) -> None:
    if index is None:
        data[field] = f"{prefix}\n{data.get(field, '')}"
    else:
        data[field][index] = f"{prefix}\n{data[field][index]}"


def generate_variable_initializer(variables: dict[str, Any]) -> str:
    initialization_version = variables.get("initialization_version", 1)
    entries = [
        {
            "name": item["name"],
            "scope": item.get("scope", "chat"),
            "initial": item.get("initial"),
            "version": initialization_version,
        }
        for item in variables.get("variables", [])
        if isinstance(item, dict) and item.get("initialization", {}).get("mode") == "tavojs"
    ]
    if not entries:
        return ""
    payload = script_safe_json(entries)
    return f"""
<!-- TAVO_VARIABLE_INIT -->
<script>
(() => {{
  const definitions = {payload};
  const clone = value => JSON.parse(JSON.stringify(value));
  const mergeMissing = (current, defaults) => {{
    if (!current || typeof current !== 'object' || Array.isArray(current)) return current;
    const next = clone(current);
    for (const [key, value] of Object.entries(defaults || {{}})) {{
      if (!(key in next)) next[key] = clone(value);
      else if (value && typeof value === 'object' && !Array.isArray(value)) next[key] = mergeMissing(next[key], value);
    }}
    return next;
  }};
  for (const definition of definitions) {{
    const scope = definition.scope || 'chat';
    const versionKey = `__tavo_card_building.init.${{definition.name}}`;
    const currentVersion = Number(tavo.get(versionKey, scope) ?? 0);
    const current = tavo.get(definition.name, scope);
    if (current == null) {{
      tavo.set(definition.name, clone(definition.initial), scope);
    }} else if (currentVersion < definition.version && definition.initial && typeof definition.initial === 'object' && !Array.isArray(definition.initial)) {{
      const upgraded = mergeMissing(current, definition.initial);
      if (JSON.stringify(upgraded) !== JSON.stringify(current)) tavo.set(definition.name, upgraded, scope);
    }}
    if (currentVersion < definition.version) tavo.set(versionKey, definition.version, scope);
  }}
}})();
</script>"""


def configured_render_files(config: dict[str, Any], key: str, fallback: list[str]) -> list[str]:
    value = config.get(key, fallback)
    return [str(item) for item in value]


def join_render_sources(root: Path, names: list[str], kind: str) -> str:
    chunks: list[str] = []
    for name in names:
        content = (root / name).read_text(encoding="utf-8").strip()
        if kind == "css":
            chunks.append(f"/* source: {name} */\n{content}")
        elif kind == "js":
            chunks.append(f"// source: {name}\n{content}")
        else:
            chunks.append(f"<!-- source: {name} -->\n{content}")
    return "\n\n".join(chunks)


def build_render_bundle(project: Path, config: dict[str, Any]) -> str:
    if not config.get("enabled"):
        return ""
    root = project / "tavo" / "rendering"
    markup = join_render_sources(root, configured_render_files(config, "markup_files", ["markup.html"]), "html")
    styles = join_render_sources(root, configured_render_files(config, "style_files", ["styles.css"]), "css")
    actions = ""
    if config.get("include_javascript"):
        actions = join_render_sources(root, configured_render_files(config, "script_files", ["actions.js"]), "js")
    parts = [
        "<!-- TAVO_RENDERING_BUNDLE -->",
        f"<style>\n{styles}\n</style>",
        markup,
    ]
    if config.get("include_javascript"):
        actions_safe = actions.replace("</script", "<\\/script")
        parts.append(f"<script>\n{actions_safe}\n</script>")
    return "\n".join(parts)


def integrate_rendering(project: Path, card: dict[str, Any], regex_payload: dict[str, Any]) -> dict[str, Any]:
    config_path = project / "tavo" / "rendering" / "config.json"
    if not config_path.exists():
        return {"schema_version": 1, "enabled": False}
    config = load_json(config_path)
    bundle = build_render_bundle(project, config)
    if not bundle:
        return config
    target = config["target"]
    if target == "first_mes_append":
        fallback = config["plain_text_fallback"].strip()
        suffix = f"\n\n{fallback}\n\n{bundle}"
        targets = greeting_fields(card["data"]) if config.get("apply_to_all_greetings", True) else [("first_mes", None)]
        for field, index in targets:
            append_to_greeting(card["data"], field, index, suffix)
    elif target == "regex_replace":
        matches = [
            entry
            for group in regex_payload.get("groups", [])
            if group.get("name") == config.get("regex_group")
            for entry in group.get("entries", [])
            if entry.get("name") == config.get("regex_entry")
        ]
        if len(matches) != 1:
            raise ValueError("渲染目标正则不唯一；验证器本应在构建前阻止此问题。")
        matches[0]["replaceString"] = matches[0]["replaceString"].replace("{{TAVO_RENDERING}}", bundle)
    return config


def to_compatible(entry: dict[str, Any]) -> dict[str, Any]:
    timing = entry.get("timing", "display")
    return {
        "id": entry.get("id"),
        "scriptName": entry["name"],
        "findRegex": entry.get("findRegex", ""),
        "replaceString": entry.get("replaceString", ""),
        "trimStrings": entry.get("trimStrings", []),
        "placement": [PLACEMENT_TO_ST[item] for item in entry.get("placements", ["char"])],
        "disabled": not entry.get("enabled", True),
        "markdownOnly": timing == "display",
        "promptOnly": timing == "send",
        "runOnEdit": False,
        "substituteRegex": SUBSTITUTION_TO_ST.get(entry.get("substitution", "none"), 0),
        "minDepth": entry.get("minDepth"),
        "maxDepth": entry.get("maxDepth"),
    }


def split_regex(groups: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[str]]:
    compatible: list[dict[str, Any]] = []
    native_only: list[dict[str, Any]] = []
    warnings: list[str] = []
    for group in groups:
        remaining: list[dict[str, Any]] = []
        for entry in group.get("entries", []):
            if entry.get("timing", "display") in PORTABLE_TIMINGS:
                compatible.append(to_compatible(entry))
            else:
                remaining.append(entry)
                warnings.append(
                    f"正则 {group.get('name', '未命名组')} / {entry.get('name', '未命名规则')} "
                    f"使用 {entry.get('timing')}，只能通过 Tavo 原生 sidecar 安装。"
                )
        if remaining:
            native_only.append({"name": f"{group.get('name', 'Regex')} · 原生", "entries": remaining})
    return compatible, native_only, warnings


def generate_deployer(card: dict[str, Any], groups: list[dict[str, Any]]) -> str:
    card_payload = script_safe_json(card, indent=2)
    regex_payload = script_safe_json(groups, indent=2)
    return f"""// 由 Tavo Card Building 生成。请在开启 JavaScript 支持的 Tavo 气泡中执行。
// 成功标准是 import 返回 ID，且角色／世界书／正则均按 ID 回读通过；弹窗取消不算成功。
const card = {card_payload};
const nativeRegexGroups = {regex_payload};
const evidence = {{ character: null, lorebook: null, regex: null, nativeRegex: [] }};
const field = (object, camel, snake) => object?.[camel] ?? object?.[snake] ?? object?.data?.[snake];
const assertSame = (label, actual, expected) => {{
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {{
    throw new Error(`${{label}} 回读不一致`);
  }}
}};
const loreContents = entries => (entries || []).map(entry => String(entry?.content ?? '')).sort();
const regexSignature = entry => JSON.stringify({{
  name: entry?.name ?? entry?.scriptName ?? '',
  findRegex: entry?.findRegex ?? '',
  replaceString: entry?.replaceString ?? '',
}});
const regexSignatures = entries => (entries || []).map(regexSignature).sort();

const imported = await tavo.character.import(card);
if (!imported || imported.characterId == null) {{
  throw new Error('角色导入被取消或没有返回 characterId');
}}

const savedCharacter = await tavo.character.get(imported.characterId);
if (!savedCharacter) throw new Error('角色按 ID 回读失败');
const savedName = field(savedCharacter, 'name', 'name');
const savedFirstMes = field(savedCharacter, 'firstMes', 'first_mes');
const savedAlternates = field(savedCharacter, 'alternateGreetings', 'alternate_greetings') ?? [];
assertSame('角色名', savedName, card.data.name);
assertSame('角色设定', field(savedCharacter, 'description', 'description'), card.data.description);
assertSame('性格', field(savedCharacter, 'personality', 'personality'), card.data.personality);
assertSame('场景', field(savedCharacter, 'scenario', 'scenario'), card.data.scenario);
assertSame('主开场', savedFirstMes, card.data.first_mes);
assertSame('备选开场', savedAlternates, card.data.alternate_greetings);
evidence.character = {{
  id: imported.characterId,
  name: savedName,
  firstMesLength: savedFirstMes.length,
  alternateGreetings: savedAlternates.length,
}};

if (imported.lorebookId != null) {{
  const savedLorebook = await tavo.lorebook.get(imported.lorebookId);
  if (!savedLorebook) throw new Error('世界书按 ID 回读失败');
  const expectedEntries = card.data.character_book?.entries ?? [];
  assertSame('世界书条目数', savedLorebook.entries?.length ?? 0, expectedEntries.length);
  assertSame('世界书关键内容', loreContents(savedLorebook.entries), loreContents(expectedEntries));
  evidence.lorebook = {{ id: imported.lorebookId, entries: savedLorebook.entries.length }};
}} else if (card.data.character_book?.entries?.length) {{
  throw new Error('卡内含世界书，但导入没有返回 lorebookId');
}}

if (imported.regexId != null) {{
  const savedRegex = await tavo.regex.get(imported.regexId);
  if (!savedRegex) throw new Error('兼容正则按 ID 回读失败');
  const expectedEntries = card.data.extensions?.regex_scripts ?? [];
  assertSame('兼容正则条目数', savedRegex.entries?.length ?? 0, expectedEntries.length);
  assertSame('兼容正则关键字段', regexSignatures(savedRegex.entries), regexSignatures(expectedEntries));
  evidence.regex = {{ id: imported.regexId, entries: savedRegex.entries.length }};
}} else if (card.data.extensions?.regex_scripts?.length) {{
  throw new Error('卡内含兼容正则，但导入没有返回 regexId');
}}

for (const group of nativeRegexGroups) {{
  const exact = await tavo.regex.find(group.name, {{ match: 'exact' }});
  let id;
  let action;
  if (exact.length) {{
    id = exact[0].id;
    action = 'kept-existing';
  }} else {{
    id = await tavo.regex.create(group);
    if (id == null) throw new Error(`用户取消了原生正则安装：${{group.name}}`);
    action = 'created';
  }}
  const saved = await tavo.regex.get(id);
  if (!saved || saved.entries?.length !== group.entries.length) {{
    throw new Error(`原生正则回读失败：${{group.name}}`);
  }}
  assertSame(`原生正则关键字段：${{group.name}}`, regexSignatures(saved.entries), regexSignatures(group.entries));
  evidence.nativeRegex.push({{ name: group.name, id, action, entries: saved.entries.length }});
}}

console.log('TAVO_IMPORT_READBACK_OK', JSON.stringify(evidence, null, 2));
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="构建 Tavo CCv3 项目")
    parser.add_argument("project", type=Path)
    args = parser.parse_args()
    project = args.project.resolve()
    findings, summary = validate_project(project)
    errors = [item for item in findings if item.level == "error"]
    if errors:
        for item in errors:
            print(f"ERROR {item.code}: {item.message}", file=sys.stderr)
        print("构建终止：先修复验证错误。", file=sys.stderr)
        return 1

    card = load_json(project / "card.json")
    variables = load_json(project / "tavo" / "variables.json")
    regex_payload = load_json(project / "tavo" / "regex.json")
    variable_initializer = generate_variable_initializer(variables)
    if variable_initializer:
        for field, index in greeting_fields(card["data"]):
            prepend_to_greeting(card["data"], field, index, variable_initializer)
    rendering_config = integrate_rendering(project, card, regex_payload)
    groups = regex_payload.get("groups", [])
    compatible, native_only, portability_warnings = split_regex(groups)

    card["data"]["modification_date"] = int(time.time())
    extensions = card["data"].setdefault("extensions", {})
    if compatible:
        existing = extensions.get("regex_scripts", [])
        if not isinstance(existing, list):
            existing = []
        extensions["regex_scripts"] = [*existing, *compatible]
    extensions["tavo_card_building"] = {
        "schema_version": 1,
        "variables": variables,
        "rendering": rendering_config,
        "native_regex_sidecar_required": bool(native_only),
    }

    output_dir = project / "dist"
    if output_dir.exists():
        resolved = output_dir.resolve()
        if resolved.parent != project or resolved.name != "dist":
            print(f"拒绝清理异常输出目录：{resolved}", file=sys.stderr)
            return 2
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    base = safe_name(card["data"]["name"])
    card_out = output_dir / f"{base}.json"
    native_out = output_dir / f"{base}.tavo-native.json"
    deployer_out = output_dir / f"{base}.tavo-deploy.js"
    card_out.write_text(json.dumps(card, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    native_out.write_text(json.dumps({
        "schema_version": 1,
        "variables": variables,
        "regex": regex_payload,
        "requires_installer": bool(native_only),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    deployer_out.write_text(generate_deployer(card, native_only), encoding="utf-8")

    manifest = {
        "schema_version": 1,
        "built_at": int(time.time()),
        "source_card_sha256": summary.get("card_sha256"),
        "card_file": card_out.name,
        "deployment_file": deployer_out.name,
        "outputs": {
            card_out.name: sha256(card_out),
            native_out.name: sha256(native_out),
            deployer_out.name: sha256(deployer_out),
        },
        "embedded_regex_entries": len(compatible),
        "native_only_regex_groups": len(native_only),
        "single_file_function_complete": not native_only,
        "warnings": [item.message for item in findings if item.level == "warning"] + portability_warnings,
        "import_status": "not-imported",
        "note": "本地构建不等于 Tavo 已导入；导入后必须按返回 ID 回读。",
    }
    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    dist_findings: list[Finding] = []
    validate_dist(project, dist_findings)
    dist_errors = [item for item in dist_findings if item.level == "error"]
    if dist_errors:
        for item in dist_errors:
            print(f"ERROR {item.code}: {item.message}", file=sys.stderr)
        print("构建终止：dist 独立复核失败。", file=sys.stderr)
        return 3
    print(json.dumps({
        "ok": True,
        "card": str(card_out),
        "native": str(native_out),
        "deployer": str(deployer_out),
        "manifest": str(manifest_path),
        "warnings": manifest["warnings"],
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
