#!/usr/bin/env python3
"""Radar experimental de Pokémon 100% na UFRN.

Usa somente uma consulta HTTP por execução a uma fonte pública de coordenadas.
NÃO usa o serviço PoGo Coordinates nem contorna autenticação, VIP ou bloqueios.
O modo padrão é simulação: sem alertas ou alteração do estado.
"""
import json
import math
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

CENTER_LAT = -5.8411921
CENTER_LON = -35.204105
RADIUS_KM = 1.8
SOURCE_URL = "https://pokecoords.iflowgo.com/iflowgopokecoords/api/v1/nearby"
STATE_PATH = Path(__file__).with_name("state.json")
DRY_RUN = os.environ.get("RADAR_DRY_RUN", "true").strip().lower() != "false"


def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1
    return 6371.0088 * 2 * math.asin(math.sqrt(
        math.sin(delta_lat / 2) ** 2 +
        math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    ))


def fetch_spawns():
    params = urllib.parse.urlencode({
        "lat": CENTER_LAT,
        "lon": CENTER_LON,
        "radius_km": RADIUS_KM,
        "layers": "spawns",
        "limit": 250,
    })
    request = urllib.request.Request(
        f"{SOURCE_URL}?{params}",
        headers={
            "Accept": "application/json",
            "User-Agent": "GoNexus-Radar-UFRN/0.1 (one personal request)",
        }
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        if "json" not in response.headers.get("Content-Type", ""):
            raise ValueError("A fonte nao retornou JSON")
        data = json.load(response)
    if not isinstance(data, dict) or not isinstance(data.get("spawns"), list):
        raise ValueError("Resposta inesperada: esperado objeto com lista 'spawns'")
    return data["spawns"]


def parse_expiration(row):
    value = row.get("expires_at") or row.get("despawn_time") or row.get("expire_timestamp")
    if value is None:
        return None
    try:
        if isinstance(value, (int, float)):
            return datetime.fromtimestamp(value / 1000 if value > 10**11 else value, tz=timezone.utc)
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).astimezone(timezone.utc)
    except (ValueError, TypeError, OverflowError):
        return None


def is_perfect(row):
    if all(row.get(k) is not None for k in ("attack_iv", "defense_iv", "stamina_iv")):
        try:
            return all(int(row[k]) == 15 for k in ("attack_iv", "defense_iv", "stamina_iv"))
        except (ValueError, TypeError):
            return False
    try:
        return math.isclose(float(row.get("percent_iv", -1)), 100.0, abs_tol=0.001)
    except (TypeError, ValueError):
        return False


def matching_spawns(rows):
    now = datetime.now(timezone.utc)
    matches = []
    for row in rows:
        if not isinstance(row, dict) or not is_perfect(row):
            continue
        try:
            lat, lon = float(row["lat"]), float(row["lon"])
        except (KeyError, ValueError, TypeError):
            continue
        if haversine(CENTER_LAT, CENTER_LON, lat, lon) > RADIUS_KM:
            continue
        expires = parse_expiration(row)
        if expires is not None and expires <= now:
            continue
        key = str(row.get("id") or row.get("encounter_id") or
                  f"{row.get('pokemon_id')}:{lat:.5f}:{lon:.5f}:{expires}")
        matches.append({
            "id": key,
            "pokemon_id": row.get("pokemon_id"),
            "name": row.get("pokemon_name") or row.get("name") or f"Pokemon #{row.get('pokemon_id', '?')}",
            "lat": lat, "lon": lon,
            "cp": row.get("cp"), "level": row.get("level"),
            "expires": expires.isoformat() if expires else None,
        })
    return matches


def send_ntfy(topic, spawn):
    title = f"Pokémon 100% na UFRN! #{spawn['pokemon_id'] or '?'}"
    coords = f"{spawn['lat']:.6f},{spawn['lon']:.6f}"
    message = f"{spawn['name']} · IV 15/15/15\nCoordenadas: {coords}"
    if spawn["cp"] is not None:
        message += f"\nCP: {spawn['cp']}"
    if spawn["expires"]:
        message += f"\nExpira (UTC): {spawn['expires']}"
    request = urllib.request.Request(
        "https://ntfy.sh/" + urllib.parse.quote(topic, safe=""),
        data=message.encode("utf-8"),
        method="POST",
        headers={
            "Title": title.encode("ascii", "ignore").decode("ascii"),
            "Priority": "high",
            "Tags": "tada",
            "Click": "https://www.google.com/maps?q=" + coords,
            "Content-Type": "text/plain; charset=utf-8",
        },
    )
    with urllib.request.urlopen(request, timeout=12) as response:
        if response.status >= 300:
            raise RuntimeError(f"ntfy HTTP {response.status}")


def main():
    print(f"Radar UFRN | raio {RADIUS_KM} km | dry-run={DRY_RUN}", flush=True)
    try:
        rows = fetch_spawns()
    except (urllib.error.URLError, ValueError, TimeoutError) as exc:
        print(f"Fonte indisponível/incompatível: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    matches = matching_spawns(rows)
    print(f"Consulta concluída: {len(rows)} registros, {len(matches)} Pokémon 100% na área.", flush=True)
    for spawn in matches[:5]:
        print(f" - #{spawn['pokemon_id'] or '?'} ({spawn['lat']:.5f},{spawn['lon']:.5f})")
    if DRY_RUN:
        print("Modo teste: nenhuma notificação foi enviada.")
        return 0

    topic = os.environ.get("NTFY_TOPIC", "").strip()
    if not topic:
        print("NTFY_TOPIC ausente; nenhum alerta enviado.", file=sys.stderr)
        return 3
    seen = set()
    if STATE_PATH.exists():
        try:
            seen = set(json.loads(STATE_PATH.read_text(encoding="utf-8")).get("sent", []))
        except (ValueError, OSError):
            pass
    delivered = 0
    for spawn in matches:
        if spawn["id"] in seen:
            continue
        send_ntfy(topic, spawn)
        seen.add(spawn["id"])
        delivered += 1
    STATE_PATH.write_text(json.dumps({"sent": sorted(seen)[-1000:]}, ensure_ascii=False), encoding="utf-8")
    print(f"Alertas enviados: {delivered}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
