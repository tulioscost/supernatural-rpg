#!/usr/bin/env python3
"""Valida um sistema Foundry e gera pacote de release com manifesto na raiz."""
import argparse
import json
import os
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
FILES = ("system.json", "README.md")
FOLDERS = ("assets", "data", "docs", "lang", "module", "styles", "templates")


def validate():
    manifest = json.loads((ROOT / "system.json").read_text(encoding="utf-8"))
    assert manifest["id"] == "supernatural-cacadores", "ID do sistema alterado"
    assert manifest["manifest"] == "https://github.com/tulioscost/supernatural-rpg/releases/latest/download/system.json"
    assert manifest["download"] == f'https://github.com/tulioscost/supernatural-rpg/releases/download/v{manifest["version"]}/supernatural-cacadores.zip'
    assert manifest["compatibility"]["minimum"] == "14"
    for name in FILES:
        assert (ROOT / name).is_file(), f"Falta {name}"
    for field in ("esmodules", "styles"):
        for relative in manifest.get(field, []):
            assert (ROOT / relative).is_file(), f"Falta {relative}"
    for lang in manifest.get("languages", []):
        assert (ROOT / lang["path"]).is_file(), f'Falta {lang["path"]}'
    library = json.loads((ROOT / "data/starter.json").read_text(encoding="utf-8"))
    assert len(library["actors"]) == 15, "Catálogo de atores diferente do informado"
    assert len(library["items"]) == 47, "Catálogo de itens diferente do informado"
    assert len(library["journals"]) == 4, "Catálogo de dossiês diferente do informado"
    catalog = json.loads((ROOT / "data/items-compendium.json").read_text(encoding="utf-8"))
    assert len(catalog) == 47, "Compêndio deve conter 47 itens"
    assert {i["name"] for i in catalog} == {i["name"] for i in library["items"]}, "Compêndio e kit inicial divergentes"
    icon_names=set()
    for item in catalog:
        src=item.get("img", "")
        assert src.startswith("systems/supernatural-cacadores/"), f'Ícone inválido: {item["name"]}'
        relative=src[len("systems/supernatural-cacadores/"):]
        assert (ROOT / relative).is_file(), f'Ícone não encontrado: {src}'
        assert src not in icon_names, f'Ícone duplicado: {src}'
        icon_names.add(src)
    assert len(icon_names)==47
    return manifest


def package():
    manifest = validate()
    destination = ROOT / "dist"
    destination.mkdir(exist_ok=True)
    archive = destination / "supernatural-cacadores.zip"
    all_files = [ROOT / name for name in FILES]
    for folder in FOLDERS:
        assert (ROOT / folder).is_dir(), f"Falta a pasta {folder}"
        all_files += [p for p in (ROOT / folder).rglob("*") if p.is_file()
                      and not any(part == "fonts" for part in p.relative_to(ROOT).parts)
                      and p.suffix.lower() not in {".ttf", ".otf", ".woff", ".woff2"}]
    with ZipFile(archive, "w", ZIP_DEFLATED) as z:
        for path in sorted(all_files):
            z.write(path, path.relative_to(ROOT).as_posix())
    (destination / "system.json").write_bytes((ROOT / "system.json").read_bytes())
    notes = destination / f'release-notes-v{manifest["version"]}.md'
    changelog = (ROOT / "docs/CHANGELOG.md").read_text(encoding="utf-8")
    notes.write_text(
        f'# Supernatural — Caçadores da Estrada v{manifest["version"]}\n\n'
        'Versão experimental e não oficial para Foundry VTT 14.\n\n'
        '## Conteúdo\n\n'
        '- Sistema instalável via URL do manifesto.\n'
        '- Fichas de caçadores e criaturas, rolagens d6, investigação e vulnerabilidades.\n'
        '- Biblioteca inicial com 15 atores, 47 itens e 4 dossiês.\n\n'
        '## Instalação\n\n'
        'No Foundry VTT, use a URL do manifesto:\n\n'
        f'`{manifest["manifest"]}`\n\n'
        'Esta URL passa a funcionar após a publicação desta Release no GitHub.\n\n'
        '## Histórico de alterações\n\n' + changelog + '\n', encoding="utf-8"
    )
    with ZipFile(archive) as z:
        assert "system.json" in z.namelist(), "system.json não está na raiz"
        assert len(z.namelist()) == len(all_files), "ZIP incompleto"
        assert json.loads(z.read("system.json"))["id"] == "supernatural-cacadores"
    print(f"Arquivo criado: {archive} ({archive.stat().st_size} bytes)")
    print(f"Notas da versão: {notes}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    manifest = validate()
    print(f'Manifesto válido: {manifest["id"]} v{manifest["version"]}')
    if not args.validate_only:
        package()
