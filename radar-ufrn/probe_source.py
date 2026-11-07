#!/usr/bin/env python3
"""Inspeciona uma vez os scripts públicos do mapa para identificar uma integração.
Não faz consultas de Pokémon nem extrai registros em massa.
"""
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import re

ROOT = "https://pogocoordinates.com/map"

def get(url):
    req = Request(url, headers={"User-Agent":"Mozilla/5.0", "Accept":"text/html,application/javascript,*/*"})
    with urlopen(req, timeout=12) as res:
        if res.status != 200: raise RuntimeError(f"HTTP {res.status}")
        return res.read(800_000).decode("utf-8",errors="replace")

class P(HTMLParser):
    scripts=[]
    def handle_starttag(self, tag, attrs):
        if tag=="script":
            src=dict(attrs).get("src")
            if src: self.scripts.append(urljoin(ROOT,src))

try:
    page=get(ROOT)
    print("Mapa HTML:",len(page),"bytes")
    parser=P();parser.feed(page)
    scripts=[s for s in parser.scripts if urlparse(s).netloc=="pogocoordinates.com"][:3]
    print("Scripts do mesmo domínio:",scripts)
    for script in scripts:
        try:
            js=get(script)
            keys=sorted(set(re.findall(r"""['"](/api/[a-zA-Z0-9_/?=&.-]+)['"]""",js)))
            print("Script",script,"endpoints públicos citados:", keys[:25])
        except Exception as exc:
            print("Script indisponível:",type(exc).__name__,str(exc)[:200])
except Exception as exc:
    print("Fonte HTML indisponível:",type(exc).__name__,str(exc)[:200])
