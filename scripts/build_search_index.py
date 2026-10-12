#!/usr/bin/env python3
"""Atualiza textos visíveis do índice sem apagar termos dinâmicos já indexados."""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlsplit

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "search-index.json"


def main() -> None:
    entries = json.loads(INDEX.read_text(encoding="utf-8"))
    for item in entries:
        route = urlsplit(item.get("url", "")).path
        if not route.endswith(".html") or "/" in route:
            continue
        page = ROOT / route
        if not page.is_file():
            continue
        soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
        for block in soup(["script", "style", "noscript", "template"]):
            block.decompose()
        content = " ".join(soup.stripped_strings)
        if content:
            item["content"] = content[:8000]
            # Mantém nomes e comandos provenientes dos dados JavaScript, não
            # presentes no HTML estático. Atualiza o texto realmente visível.
            previous_search = item.get("search", "")
            item["search"] = (content + " " + previous_search)[:55000]
    INDEX.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
