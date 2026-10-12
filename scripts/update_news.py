#!/usr/bin/env python3
"""Atualiza as cinco últimas notícias oficiais, preservando dados válidos quando há falha."""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
NEWS = ROOT / "news.json"
SOURCE = "https://pokemongo.com/pt-BR/news"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; GoNexusNewsBot/1.0; +https://github.com/evandroferreira8/GoNexus)"}


def official_article(url: str) -> bool:
    parsed = urlparse(url)
    return (parsed.scheme == "https" and parsed.hostname == "pokemongo.com"
            and re.fullmatch(r"/(?:pt-BR|pt_BR)/news/[a-z0-9][a-z0-9-]*", parsed.path, re.I) is not None)


def get_html(session: requests.Session, url: str) -> str:
    response = session.get(url, timeout=25, headers=HEADERS)
    response.raise_for_status()
    return response.text


def get_candidates(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    urls = []
    for link in soup.find_all("a", href=True):
        url = urljoin(SOURCE, link["href"]).split("#", 1)[0].split("?", 1)[0]
        if official_article(url) and url not in urls:
            urls.append(url)
    return urls


def meta_content(soup: BeautifulSoup, property_name: str) -> str:
    tag = soup.find("meta", attrs={"property": property_name})
    return tag.get("content", "").strip() if tag else ""


def get_article(session: requests.Session, url: str) -> dict:
    soup = BeautifulSoup(get_html(session, url), "html.parser")
    headline = meta_content(soup, "og:title")
    if not headline:
        heading = soup.find("h1")
        headline = heading.get_text(" ", strip=True) if heading else ""
    headline = re.sub(r"\s*[—|-]\s*Pokémon GO\s*$", "", headline).strip()
    image = meta_content(soup, "og:image")
    if image.startswith("//"):
        image = "https:" + image
    if not (headline and 8 <= len(headline) <= 250):
        raise ValueError("Título inválido em " + url)
    if image and not image.startswith("https://"):
        image = ""
    return {"title": headline, "url": url.replace("/pt_BR/", "/pt-BR/"), "image": image}


def main() -> int:
    try:
        with requests.Session() as session:
            candidates = get_candidates(get_html(session, SOURCE))
            if len(candidates) < 5:
                raise ValueError("Página oficial retornou menos de cinco links de notícias.")
            items = [get_article(session, url) for url in candidates[:5]]
        if len({article["url"] for article in items}) != 5:
            raise ValueError("Lista de notícias contém links duplicados.")
        previous = json.loads(NEWS.read_text(encoding="utf-8")) if NEWS.exists() else {}
        if previous.get("items") == items:
            print("Nenhuma notícia nova; news.json preservado.")
            return 0
        payload = {
            "source": SOURCE,
            "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "items": items,
        }
        NEWS.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("Novidades oficiais atualizadas:", len(items))
        return 0
    except Exception as exc:
        print("Falha na coleta: news.json anterior foi preservado.", str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
