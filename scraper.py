import asyncio
import json
import re
import subprocess
import os
from datetime import date, timedelta
from playwright.async_api import async_playwright

COOKIES = [
    {"name": "SAPISID", "value": "3BcZ46bhF4y06zVv/A5rFgwgEJ9ikcESm4", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "__Secure-3PAPISID", "value": "3BcZ46bhF4y06zVv/A5rFgwgEJ9ikcESm4", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "__Secure-1PAPISID", "value": "3BcZ46bhF4y06zVv/A5rFgwgEJ9ikcESm4", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "AEC", "value": "AaJma5up7JgstdRO6CtMGb392qcyl6IHyweMDquXqNS6CxOe0hEW6vPcBw", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "OSID", "value": "g.a0009QhE0sOl9D6agAUBRqJqKA5oWNQ9J4AP3F_6v97K3K2HQPy_uSgrqFuWgn_-W7PKviqIgwACgYKATkSARcSFQHGX2Mi8-wijqEI5grWr5bB_3cWBRoVAUF8yKorYynvaBqB-koaKaxOUptz0076", "domain": "ads.google.com", "path": "/", "secure": True},
    {"name": "__Secure-OSID", "value": "g.a0009QhE0sOl9D6agAUBRqJqKA5oWNQ9J4AP3F_6v97K3K2HQPy_IHUy8V4IxbX0FhX5Y_178QACgYKAeQSARcSFQHGX2MiqQet5ADZ4xH0ObJLUXfnIRoVAUF8yKqekZZtl026vfiLyC4iTCuh0076", "domain": "ads.google.com", "path": "/", "secure": True},
    {"name": "SID", "value": "g.a0008QhE0je9dBAz6MawE5ABwozkas-L-L8lfLOpAVWowLcixF3XMVMpCooKQ_vpW66AhYUAzQACgYKAfwSAQ4SFQHGX2MiSTOvP-_Bu0WdUgK9F0cv0xoVAUF8yKoUyy5BJy8M8Mvs2y5CTYGa0076", "domain": ".google.com", "path": "/", "secure": False},
    {"name": "HSID", "value": "AKegJNZIiOawzVhW5", "domain": ".google.com", "path": "/", "secure": False},
    {"name": "SSID", "value": "A8xyoufcEkjXw0EPK", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "APISID", "value": "GFkPPsDuAl7tw0cn/AK23yl5K1DJxwM6a7", "domain": ".google.com", "path": "/", "secure": False},
    {"name": "__Secure-1PSID", "value": "g.a0008QhE0je9dBAz6MawE5ABwozkas-L-L8lfLOpAVWowLcixF3XN9lRoC15rXk5b23GPt8zfAACgYKAeMSAQ4SFQHGX2MiyHFE2_sr_n88AupFnLNyVxoVAUF8yKotRZKQdXm41TcX9U2gxEcy0076", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "__Secure-3PSID", "value": "g.a0008QhE0je9dBAz6MawE5ABwozkas-L-L8lfLOpAVWowLcixF3XD-c1lD6ppN0VnwswkK2SJAACgYKAb4SAQ4SFQHGX2MiI5nzajanke7U70RHsGEnnRoVAUF8yKp8jpodCIOhqg1896EoQT410076", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "SIDCC", "value": "AKEyXzXieoPk3b8xCQpFqkl-5bON_WpqPjBKm4ybjmYKa4zoRRQcq3nps6mFCKlJZptzL7VMjiY", "domain": ".google.com", "path": "/", "secure": False},
    {"name": "__Secure-1PSIDCC", "value": "AKEyXzXak8Szfy0kn1yR0INU2HFatcVwlY8K9a57QEwXpWqEUw9cVD2inHLShyfnUN0oCRqGOQUy", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "__Secure-3PSIDCC", "value": "AKEyXzUbdAecogvwVtTkpZT9uYG-zrKh2jLysxvd9qIvWsRN3BQFUNadMTBK-PoNH3orznIWPcU", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "__Secure-1PSIDTS", "value": "sidts-CjEBWhotCUdZX-eez0RZ_azRvFH3nq8jPuaOjSo5tqUCEwCKpDgyRtG2qy68sLGGWmWwEAA", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "__Secure-3PSIDTS", "value": "sidts-CjEBWhotCUdZX-eez0RZ_azRvFH3nq8jPuaOjSo5tqUCEwCKpDgyRtG2qy68sLGGWmWwEAA", "domain": ".google.com", "path": "/", "secure": True},
    {"name": "ADS_CUSTOMER_ACCOUNT_SESSION_INFO", "value": "ScCigAoksJDxsxFQz4ZP-GxBm5_virC_X-dyl1lI4m0=authuser-0", "domain": ".ads.google.com", "path": "/", "secure": True},
    {"name": "SOCS", "value": "CAISHAgCEhJnd3NfMjAyNTA2MjQtMF9SQzEaAmVuIAEaBgiAvvfCBg", "domain": ".google.com", "path": "/", "secure": True},
]

ACCOUNTS = [
    {"name": "Atlanta",      "cid": "7222999046",  "bid": "2660897135",  "url": "https://ads.google.com/localservices/reports?cid=7222999046&bid=2660897135&pid=9999999999&euid=4022083214&hl=en&gl=US"},
    {"name": "Tampa",        "cid": "3682185705",  "bid": "2663389629",  "url": "https://ads.google.com/localservices/reports?cid=3682185705&bid=2663389629&pid=9999999999&euid=4022083214&hl=en&gl=US"},
    {"name": "Jacksonville", "cid": "8806025073",  "bid": "2680685916",  "url": "https://ads.google.com/localservices/reports?cid=8806025073&bid=2680685916&pid=9999999999&euid=4022083214&hl=en&gl=US"},
    {"name": "Miami",        "cid": "5317259275",  "bid": "3587707983",  "url": "https://ads.google.com/localservices/reports?cid=5317259275&bid=3587707983&pid=9999999999&euid=4022083214&hl=en&gl=US"},
    {"name": "Charlotte",    "cid": "4553610820",  "bid": "3854416283",  "url": "https://ads.google.com/localservices/reports?cid=4553610820&bid=3854416283&pid=9999999999&euid=4022083214&hl=en&gl=US"},
    {"name": "NV Houston",   "cid": "9296298329",  "bid": "10957037773", "url": "https://ads.google.com/localservices/reports?cid=9296298329&bid=10957037773&pid=9999999999&euid=4022083214&hl=en&gl=US"},
    {"name": "NV Tampa",     "cid": "7377745321",  "bid": "10955748646", "url": "https://ads.google.com/localservices/reports?cid=7377745321&bid=10955748646&pid=9999999999&euid=4022083214&hl=en&gl=US"},
]

# Даты: с 1-го числа текущего месяца по вчера
today = date.today()
START_DATE = date(today.year, today.month, 1)
END_DATE = today - timedelta(days=1)

BL = "boq_ghsuiserver_20260417.06_p0"

# Путь к репо на десктопе
REPO_PATH = os.path.dirname(os.path.abspath(__file__))


def build_freq(cid, bid, y, m, d):
    inner  = json.dumps(f'[[{cid},{bid},9999999999],[[null,null,[{y},{m},{d}],[{y},{m},{d}]]]]')
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


async def get_at_and_fsid(page):
    at = await page.evaluate("""
        () => {
            for (const s of document.querySelectorAll('script')) {
                const m = s.textContent.match(/"SNlM0e":"([^"]+)"/);
                if (m) return m[1];
            }
            return null;
        }
    """)
    fsid = await page.evaluate("""
        () => {
            for (const s of document.querySelectorAll('script')) {
                const m = s.textContent.match(/"FdrFJe":"(-?\\d+)"/);
                if (m) return m[1];
            }
            return null;
        }
    """)
    return at, fsid


async def fetch_day(page, cid, bid, day, at, fsid):
    y, m, d = day.year, day.month, day.day
    freq = build_freq(cid, bid, y, m, d)
    response = await page.request.post(
        "https://ads.google.com/_/GhsUi/data/batchexecute",
        params={
            "rpcids": "EZtofb,m3nRtd,bIewic",
            "source-path": "/localservices/reports",
            "f.sid": fsid, "bl": BL,
            "hl": "en", "gl": "US",
            "soc-app": "598", "soc-platform": "1", "soc-device": "2", "rt": "c",
        },
        form={"f.req": freq, "at": at},
    )
    text = await response.text()
    leads, spend = parse_response(text)
    cpl = round(spend / leads) if leads > 0 else 0
    return {"date": day.strftime("%Y-%m-%d"), "leads": leads, "spend": spend, "cpl": cpl}


async def scrape_account(context, account):
    print(f"\n=== {account['name']} ===")
    page = await context.new_page()
    results = []
    try:
        await page.goto(account["url"])
        await asyncio.sleep(4)
        at, fsid = await get_at_and_fsid(page)
        if not at or not fsid:
            print("  ERROR: нет сессии")
            return {"name": account["name"], "data": []}
        current = START_DATE
        while current <= END_DATE:
            try:
                row = await fetch_day(page, account["cid"], account["bid"], current, at, fsid)
                if row["leads"] > 0:
                    results.append(row)
                    print(f"  {row['date']}: leads={row['leads']} spend=${row['spend']} cpl=${row['cpl']}")
                else:
                    print(f"  {row['date']}: 0 leads")
            except Exception as e:
                print(f"  {current}: ERROR - {e}")
            current += timedelta(days=1)
    finally:
        await page.close()
    return {"name": account["name"], "data": results}


def git_push(output_path):
    try:
        subprocess.run(["git", "add", "data.json"], cwd=REPO_PATH, check=True)
        subprocess.run(["git", "commit", "-m", f"update data {date.today()}"], cwd=REPO_PATH, check=True)
        subprocess.run(["git", "push"], cwd=REPO_PATH, check=True)
        print(f"\nПушнуто на GitHub!")
    except subprocess.CalledProcessError as e:
        print(f"\nОшибка git push: {e}")


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36"
        )
        await context.add_cookies(COOKIES)
        print(f"Парсим с {START_DATE} по {END_DATE}")

        all_results = []
        for account in ACCOUNTS:
            result = await scrape_account(context, account)
            all_results.append(result)
        await browser.close()

    # Плоский массив для дашборда
    flat_data = []
    for acc in all_results:
        for row in acc["data"]:
            flat_data.append({
                "date": row["date"],
                "location": acc["name"],
                "leads": row["leads"],
                "spend": row["spend"],
                "cpl": row["cpl"]
            })

    # Сохраняем data.json в репо
    output_path = os.path.join(REPO_PATH, "data.json")
    with open(output_path, "w") as f:
        json.dump(flat_data, f, indent=2)
    print(f"\nСохранено: {output_path} ({len(flat_data)} записей)")

    # Пушим на GitHub
    git_push(output_path)


asyncio.run(main())
