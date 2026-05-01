import json
import re
import subprocess
import os
import requests
from datetime import date, timedelta

# Берём куки из секрета GitHub
COOKIES_RAW = os.environ.get("GOOGLE_COOKIES", "")
COOKIES = {}
for part in COOKIES_RAW.split(";"):
    part = part.strip()
    if "=" in part:
        k, v = part.split("=", 1)
        COOKIES[k.strip()] = v.strip()

ACCOUNTS = [
    {"name": "Atlanta",      "cid": "7222999046",  "bid": "2660897135"},
    {"name": "Tampa",        "cid": "3682185705",  "bid": "2663389629"},
    {"name": "Jacksonville", "cid": "8806025073",  "bid": "2680685916"},
    {"name": "Miami",        "cid": "5317259275",  "bid": "3587707983"},
    {"name": "Charlotte",    "cid": "4553610820",  "bid": "3854416283"},
    {"name": "NV Houston",   "cid": "9296298329",  "bid": "10957037773"},
    {"name": "NV Tampa",     "cid": "7377745321",  "bid": "10955748646"},
]

START_DATE = date(2026, 4, 22)
END_DATE = date(2026, 4, 30)
BL = "boq_ghsuiserver_20260417.06_p0"
REPO_PATH = os.path.dirname(os.path.abspath(__file__))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://ads.google.com",
    "Referer": "https://ads.google.com/localservices/reports",
}

def get_at_fsid(cid, bid):
    url = f"https://ads.google.com/localservices/reports?cid={cid}&bid={bid}&pid=9999999999&euid=4022083214&hl=en&gl=US"
    r = requests.get(url, cookies=COOKIES, headers=HEADERS)
    at = re.search(r'"SNlM0e":"([^"]+)"', r.text)
    fsid = re.search(r'"FdrFJe":"(-?\d+)"', r.text)
    print(f"  at={'OK' if at else 'NONE'} fsid={'OK' if fsid else 'NONE'} status={r.status_code}")
    return (at.group(1) if at else None), (fsid.group(1) if fsid else None)

def build_freq(cid, bid, y, m, d):
    inner = json.dumps(f'[[{cid},{bid},9999999999],[[null,null,[{y},{m},{d}],[{y},{m},{d}]]]]')
    inner3 = json.dumps(f'[[{cid},{bid},9999999999],[[null,null,[{y},{m},{d}],[{y},{m},{d}]]],1]')
    return f'[[["EZtofb",{inner},null,"3"],["m3nRtd",{inner},null,"4"],["bIewic",{inner3},null,"5"]]]'

def parse_response(text):
    leads = 0
    spend = 0.0
    for line in text.split("\n"):
        if not line.strip() or line.strip().isdigit():
            continue
        try:
            data = json.loads(line)
            for item in data:
                if not isinstance(item, list) or len(item) < 3 or item[0] != "wrb.fr":
                    continue
                if item[1] not in ("EZtofb", "bIewic"):
                    continue
                flat = item[2] if item[2] else ""
                m = re.search(r',\[(\d+),null,\d+,null,\[', flat)
                if m:
                    leads = int(m.group(1))
                m = re.search(r'\[(\d+),"USD"\]', flat)
                if m:
                    spend = int(m.group(1)) / 1000000
        except Exception:
            continue
    return leads, round(spend, 2)

def fetch_day(cid, bid, day, at, fsid):
    y, m, d = day.year, day.month, day.day
    freq = build_freq(cid, bid, y, m, d)
    r = requests.post(
        "https://ads.google.com/_/GhsUi/data/batchexecute",
        params={"rpcids": "EZtofb,m3nRtd,bIewic", "source-path": "/localservices/reports",
                "f.sid": fsid, "bl": BL, "hl": "en", "gl": "US",
                "soc-app": "598", "soc-platform": "1", "soc-device": "2", "rt": "c"},
        data={"f.req": freq, "at": at},
        cookies=COOKIES, headers=HEADERS,
    )
    leads, spend = parse_response(r.text)
if leads == 0:
    print(f"  RAW: {r.text[:300]}")
    break
    cpl = round(spend / leads) if leads > 0 else 0
    return {"date": day.strftime("%Y-%m-%d"), "leads": leads, "spend": spend, "cpl": cpl}

flat_data = []
print(f"Куки загружены: {len(COOKIES)} штук")
print(f"Парсим с {START_DATE} по {END_DATE}")

for acc in ACCOUNTS:
    print(f"\n=== {acc['name']} ===")
    at, fsid = get_at_fsid(acc["cid"], acc["bid"])
    if not at or not fsid:
        print("  ERROR: нет сессии — пропускаем")
        continue
    current = START_DATE
    while current <= END_DATE:
        row = fetch_day(acc["cid"], acc["bid"], current, at, fsid)
        row["location"] = acc["name"]
        if row["leads"] > 0:
            flat_data.append(row)
            print(f"  {row['date']}: leads={row['leads']} spend=${row['spend']} cpl=${row['cpl']}")
        else:
            print(f"  {row['date']}: 0 leads")
        current += timedelta(days=1)

output_path = os.path.join(REPO_PATH, "data.json")
with open(output_path, "w") as f:
    json.dump(flat_data, f, indent=2)
print(f"\nСохранено: {output_path} ({len(flat_data)} записей)")

subprocess.run(["git", "config", "user.email", "action@github.com"], cwd=REPO_PATH)
subprocess.run(["git", "config", "user.name", "GitHub Action"], cwd=REPO_PATH)
subprocess.run(["git", "add", "data.json"], cwd=REPO_PATH)
result = subprocess.run(["git", "commit", "-m", f"update data {date.today()}"], cwd=REPO_PATH)
if result.returncode == 0:
    subprocess.run(["git", "push"], cwd=REPO_PATH)
    print("Запушено!")
else:
    print("Нет изменений")
