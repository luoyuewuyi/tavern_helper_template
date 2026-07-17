#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from build_tavo_project import safe_name as build_safe_name, split_regex
from new_tavo_project import safe_name as new_safe_name
from validate_tavo_project import validate_dist, validate_project


SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE = SKILL_DIR / "assets" / "project-template"


class TavoToolingTests(unittest.TestCase):
    def make_project(self, root: Path) -> Path:
        project = root / "Haanja [Sinisistar 2]"
        shutil.copytree(TEMPLATE, project)
        card_path = project / "card.json"
        card = json.loads(card_path.read_text(encoding="utf-8"))
        card["data"].update({
            "name": "Haanja [Sinisistar 2]",
            "description": "调查员",
            "personality": "克制",
            "scenario": "旧车站",
            "first_mes": "雨夜里，{{char}} 把名册推给 {{user}}。",
            "mes_example": "<START>\n{{char}}：先核对证据。",
        })
        card_path.write_text(json.dumps(card, ensure_ascii=False), encoding="utf-8")
        return project

    def test_safe_name_preserves_brackets(self) -> None:
        self.assertEqual(new_safe_name("Haanja [Sinisistar 2]"), "Haanja [Sinisistar 2]")
        self.assertEqual(build_safe_name("Haanja [Sinisistar 2]"), "Haanja [Sinisistar 2]")
        self.assertEqual(new_safe_name("CON"), "_CON")
        self.assertEqual(build_safe_name("CON.txt"), "_CON.txt")

    def test_minimal_project_validates(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            project = self.make_project(Path(temp))
            findings, summary = validate_project(project)
            self.assertEqual(summary["errors"], 0, findings)

    def test_mvu_and_repeated_initialization_are_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            project = self.make_project(Path(temp))
            card_path = project / "card.json"
            card = json.loads(card_path.read_text(encoding="utf-8"))
            card["data"]["system_prompt"] = "<UpdateVariable><initvar>{{setvar::hp::100}}</initvar></UpdateVariable>"
            card_path.write_text(json.dumps(card, ensure_ascii=False), encoding="utf-8")
            findings, _ = validate_project(project)
            codes = {item.code for item in findings if item.level == "error"}
            self.assertIn("ST-MVU", codes)
            self.assertIn("VAR-REINIT", codes)

    def test_tavern_sync_and_lorebook_setvar_are_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            project = self.make_project(Path(temp))
            card_path = project / "card.json"
            card = json.loads(card_path.read_text(encoding="utf-8"))
            card["data"]["character_book"] = {
                "name": "Test",
                "entries": [{
                    "id": 1,
                    "name": "Reset",
                    "keys": ["reset"],
                    "constant": False,
                    "content": "{{setvar::hp::100}}",
                }],
            }
            card_path.write_text(json.dumps(card, ensure_ascii=False), encoding="utf-8")
            (project / "tavo" / "rogue.js").write_text("TavernSync.push();", encoding="utf-8")
            findings, _ = validate_project(project)
            codes = {item.code for item in findings if item.level == "error"}
            self.assertIn("ST-SYNC", codes)
            self.assertIn("LORE-REINIT", codes)

    def test_native_receive_regex_stays_in_sidecar(self) -> None:
        compatible, native, warnings = split_regex([{
            "name": "Test",
            "entries": [
                {"name": "Display", "timing": "display", "placements": ["char"]},
                {"name": "Receive", "timing": "receive", "placements": ["char"]},
            ],
        }])
        self.assertEqual(len(compatible), 1)
        self.assertEqual(len(native), 1)
        self.assertTrue(warnings)

    def test_build_closes_render_variable_and_deploy_runtime(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            project = self.make_project(Path(temp))
            card_path = project / "card.json"
            card = json.loads(card_path.read_text(encoding="utf-8"))
            card["data"]["alternate_greetings"] = ["备用开场。"]
            card_path.write_text(json.dumps(card, ensure_ascii=False), encoding="utf-8")

            variables_path = project / "tavo" / "variables.json"
            variables = json.loads(variables_path.read_text(encoding="utf-8"))
            variables["variables"] = [{
                "name": "status",
                "scope": "chat",
                "type": "object",
                "initial": {"hp": 100},
                "initialization": {"mode": "tavojs", "idempotent": True},
                "description": "角色状态",
                "writer": "TavoJS action",
                "readers": ["status panel"],
                "reset": "new chat only",
            }]
            variables_path.write_text(json.dumps(variables, ensure_ascii=False), encoding="utf-8")

            render_root = project / "tavo" / "rendering"
            config = json.loads((render_root / "config.json").read_text(encoding="utf-8"))
            config.update({
                "enabled": True,
                "target": "first_mes_append",
                "include_javascript": True,
                "plain_text_fallback": "状态：生命 100。",
            })
            (render_root / "config.json").write_text(json.dumps(config, ensure_ascii=False), encoding="utf-8")
            (render_root / "markup.html").write_text('<section class="status-card">生命 <b>100</b></section>', encoding="utf-8")
            (render_root / "tokens.css").write_text(':root { --status-ink: #f3ead8; --status-surface: #342d3d; }', encoding="utf-8")
            (render_root / "styles.css").write_text('.status-card { color: #f3ead8; background: #342d3d; padding: 1rem; }', encoding="utf-8")
            (render_root / "responsive.css").write_text('@media (max-width: 34rem) { .status-card { padding: .75rem; } }', encoding="utf-8")
            (render_root / "state-adapter.js").write_text("const statusModel = { hp: tavo.get('status.hp') ?? 100 };", encoding="utf-8")
            (render_root / "actions.js").write_text("document.currentScript?.closest('.status-card');", encoding="utf-8")
            (render_root / "lifecycle.js").write_text("void statusModel;", encoding="utf-8")

            result = subprocess.run(
                [sys.executable, "-B", "-X", "utf8", str(SKILL_DIR / "scripts" / "build_tavo_project.py"), str(project)],
                capture_output=True,
                text=True,
                encoding="utf-8",
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            manifest = json.loads((project / "dist" / "manifest.json").read_text(encoding="utf-8"))
            built = json.loads((project / "dist" / manifest["card_file"]).read_text(encoding="utf-8"))
            greetings = [built["data"]["first_mes"], *built["data"]["alternate_greetings"]]
            self.assertIn("<!-- TAVO_RENDERING_BUNDLE -->", built["data"]["first_mes"])
            self.assertIn("<!-- TAVO_RENDERING_BUNDLE -->", built["data"]["alternate_greetings"][0])
            self.assertIn("/* source: tokens.css */", built["data"]["first_mes"])
            self.assertIn("// source: state-adapter.js", built["data"]["first_mes"])
            self.assertTrue(all("<!-- TAVO_VARIABLE_INIT -->" in greeting for greeting in greetings))
            self.assertIn("if (current == null)", greetings[0])
            self.assertLess(greetings[0].index("<!-- TAVO_VARIABLE_INIT -->"), greetings[0].index("<!-- TAVO_RENDERING_BUNDLE -->"))
            self.assertIn("currentVersion < definition.version", greetings[0])
            self.assertTrue(manifest["single_file_function_complete"])
            deployer = (project / "dist" / manifest["deployment_file"]).read_text(encoding="utf-8")
            self.assertIn("tavo.character.import(card)", deployer)
            self.assertIn("TAVO_IMPORT_READBACK_OK", deployer)
            self.assertIn("备选开场", deployer)
            self.assertIn("世界书关键内容", deployer)
            self.assertIn("兼容正则关键字段", deployer)
            dist_findings = []
            validate_dist(project, dist_findings)
            self.assertFalse([item for item in dist_findings if item.level == "error"], dist_findings)


if __name__ == "__main__":
    unittest.main()
