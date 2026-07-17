#!/usr/bin/env python3
"""Create a clean Tavo card project without copying another character card."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import time
from pathlib import Path


INVALID = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
RESERVED = {
    "CON", "PRN", "AUX", "NUL",
    *(f"COM{i}" for i in range(1, 10)),
    *(f"LPT{i}" for i in range(1, 10)),
}


def safe_name(value: str) -> str:
    cleaned = INVALID.sub("_", value).rstrip(" .").strip()
    if not cleaned:
        raise ValueError("角色名清洗后为空")
    if cleaned.split(".", 1)[0].upper() in RESERVED:
        cleaned = f"_{cleaned}"
    return cleaned[:100]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="新建 AI 可维护的 Tavo CCv3 角色卡项目")
    parser.add_argument("name", help="角色显示名；方括号等合法字符会保留")
    parser.add_argument("--root", type=Path, help="项目根目录，默认 <仓库>/tavo_cards")
    parser.add_argument("--creator", default="", help="写入 CCv3 creator")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    skill_dir = Path(__file__).resolve().parent.parent
    repo_root = skill_dir.parents[2]
    root = (args.root or (repo_root / "tavo_cards")).resolve()
    target = root / safe_name(args.name)
    template = skill_dir / "assets" / "project-template"
    if target.exists():
        print(f"ERROR: 项目已存在，拒绝覆盖：{target}", file=sys.stderr)
        return 2
    root.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template, target)
    card_path = target / "card.json"
    card = json.loads(card_path.read_text(encoding="utf-8"))
    now = int(time.time())
    card["data"]["name"] = args.name
    card["data"]["creator"] = args.creator
    card["data"]["creation_date"] = now
    card["data"]["modification_date"] = now
    card_path.write_text(json.dumps(card, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    readme = target / "README.md"
    readme.write_text(readme.read_text(encoding="utf-8").replace("- 角色：", f"- 角色：{args.name}"), encoding="utf-8")
    print(json.dumps({"ok": True, "project": str(target), "display_name": args.name}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
