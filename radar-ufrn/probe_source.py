#!/usr/bin/env python3
"""Diagnóstico pontual dos recursos públicos da página do mapa.
Sem extração de spawns, bypass de acesso ou consulta repetitiva.
"""
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import re

ROOT = "https://pogocoordinates.com/map"

def get(url):
    req=Request(url,headers={"User-Agent":"Mozilla/5.0","Accept":"text/html,application/javascript,*/*"})
    with urlopen(req,timeout=12) as res:
        return res.read(1_200_000).decode("utf-8",errors="replace")

class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls=[]
    def handle_starttag(self,tag,attrs):
        if tag=="script":
            src=dict(attrs).get("src")
            if src: self.urls.append(urljoin(ROOT,src))

page=get(ROOT)
p=Scripts();p.feed(page)
scripts=list(dict.fromkeys(x for x in p.urls if urlparse(x).netloc=="pogocoordinates.com"))
print("Mapa carregado; scripts públicos:",len(scripts))
for src in scripts:
    print("Script:",urlparse(src).path)
# Somente arquivos que a página já requisita no carregamento normal.
for src in scripts[:18]:
    try:
        js=get(src)
        routes=sorted(set(re.findall(r"/api/[a-zA-Z0-9_/.-]{3,100}",js)))
        if routes:
            print("ROUTES",urlparse(src).path,routes[:40])
        for word in ("spawn","nearby","pokemon_id","min_iv","mapbox"):
            if word in js.lower():
                print("KEYWORD",urlparse(src).path,word)
    except Exception as exc:
        print("Erro ao ler script:",type(exc).__name__,str(exc)[:100])
