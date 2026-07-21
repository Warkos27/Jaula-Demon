#!/usr/bin/env python3
import json
import random
import datetime
import urllib.request
import urllib.error

BASE_URL = "https://36gjnb0h5d.execute-api.us-east-2.amazonaws.com"
HEADERS = {"Accept": "application/json", "Content-Type": "application/json"}


def fetch(method: str, path: str, data=None):
    url = BASE_URL + path
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            text = resp.read().decode("utf-8")
            return resp.status, json.loads(text) if text else None
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8")
        try:
            return exc.code, json.loads(body)
        except Exception:
            return exc.code, body
    except Exception as exc:
        return None, str(exc)


def create_active_lots(target_count=10):
    status, lots = fetch("GET", "/lotes/activos")
    if status != 200:
        raise RuntimeError(f"Failed to fetch active lots: {status} {lots}")

    if not isinstance(lots, list):
        raise RuntimeError(f"Unexpected active lots response: {lots}")

    needed = target_count - len(lots)
    if needed <= 0:
        print(f"Already have {len(lots)} active lots.")
        return [lot["id_lote"] for lot in lots[:target_count]]

    print(f"Creating {needed} active lot(s)...")
    for i in range(needed):
        index = len(lots) + i + 1
        payload = {
            "id_jaula": f"Jaula {index:02d}",
            "cantidad_inicial": 1200 + index * 20,
            "costo_pollito_unitario": round(1.15 + index * 0.02, 2),
            "fecha_inicio": (datetime.date.today() - datetime.timedelta(days=random.randint(5, 30))).isoformat(),
            "estado": "activo",
            "fecha_fin": None,
        }
        status, result = fetch("POST", "/lotes", payload)
        print("POST /lotes", status, result)

    status, lots = fetch("GET", "/lotes/activos")
    if status != 200 or not isinstance(lots, list):
        raise RuntimeError(f"Failed to refresh active lots: {status} {lots}")
    return [lot["id_lote"] for lot in lots[:target_count]]


def insert_gastos(lot_ids, count=10):
    print(f"Inserting {count} gastos...")
    tipos = ["alimento", "medicinas", "agua", "luz", "otros"]
    for i in range(count):
        tipo = random.choice(tipos)
        payload = {
            "id_lote": lot_ids[i % len(lot_ids)],
            "tipo_gasto": tipo,
            "monto_total": round(random.uniform(120, 1100), 2),
            "cantidad_kg": round(random.uniform(8, 160), 2) if tipo == "alimento" else None,
            "fecha_registro": (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 18))).isoformat(),
        }
        status, result = fetch("POST", "/gastos", payload)
        print(f"  {i+1}.", status, result)


def insert_mortalidad(lot_ids, count=10):
    print(f"Inserting {count} mortalidad records...")
    causas = ["Estrés térmico", "Aplastamiento", "Problema respiratorio", "Desconocido", "Enfermedad", "Trauma"]
    for i in range(count):
        payload = {
            "id_lote": lot_ids[i % len(lot_ids)],
            "cantidad_bajas": random.randint(1, 25),
            "causa_probable": random.choice(causas),
            "fecha_registro": (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 18))).isoformat(),
        }
        status, result = fetch("POST", "/mortalidad", payload)
        print(f"  {i+1}.", status, result)


def insert_ventas(lot_ids, count=4):
    print(f"Inserting {count} ventas/cerrar records...")
    for i in range(count):
        payload = {
            "id_lote": lot_ids[i % len(lot_ids)],
            "kilos_totales_vendidos": round(random.uniform(400, 1200), 2),
            "precio_por_kilo": round(random.uniform(0.9, 1.8), 2),
            "ingreso_total": None,
            "fecha_venta": (datetime.date.today() - datetime.timedelta(days=random.randint(1, 12))).isoformat(),
        }
        payload["ingreso_total"] = round(payload["kilos_totales_vendidos"] * payload["precio_por_kilo"], 2)
        status, result = fetch("POST", "/ventas/cerrar", payload)
        print(f"  {i+1}.", status, result)


def print_summary():
    status, report = fetch("GET", "/reportes/resumen")
    print("\nFinal report:")
    print(status, report)


if __name__ == "__main__":
    lot_ids = create_active_lots(10)
    insert_gastos(lot_ids, 10)
    insert_mortalidad(lot_ids, 10)
    insert_ventas(lot_ids, 4)
    print_summary()
