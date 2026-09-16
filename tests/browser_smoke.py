"""End-to-end prototype checks. Run against a running Vite server.

Usage: python tests/browser_smoke.py [http://127.0.0.1:5173]
Requires the Python playwright package and its Chromium browser.
Screenshots are written to the ignored test-results/ directory.
"""

import json
from pathlib import Path
import sys

from playwright.sync_api import expect, sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5173"
KEY = "kocie-archiwum.progress.v1"
OUTPUT = Path(__file__).resolve().parent.parent / "test-results"
OUTPUT.mkdir(exist_ok=True)


def stored(page):
    return page.evaluate("key => localStorage.getItem(key)", KEY)


def upload(page, contents):
    page.get_by_label("Plik kopii postępu").set_input_files({
        "name": "kopia.json", "mimeType": "application/json", "buffer": contents.encode(),
    })


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 1100})
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="Wielkie tajemnice.")).to_be_visible()
    page.screenshot(path=str(OUTPUT / "home-desktop.png"), full_page=True)

    # Typed mathematical answers, invalid input and hints.
    page.get_by_role("button", name="Otwórz archiwum", exact=True).click()
    expect(page.locator(".katex")).to_be_visible()
    expect(page.get_by_role("button", name="2 Galeria księżycowa")).to_be_disabled()
    page.get_by_label("Twoja odpowiedź", exact=True).fill("1/0")
    page.get_by_role("button", name="Sprawdź", exact=True).click()
    expect(page.get_by_text("Mianownik nie może być zerem.", exact=False)).to_be_visible()
    assert len(json.loads(stored(page))["tasks"]["mapa"]["attempts"]) == 0
    page.get_by_label("Twoja odpowiedź", exact=True).fill("0,25")
    page.get_by_role("button", name="Sprawdź", exact=True).click()
    expect(page.get_by_text("To jeszcze nie ten wynik.", exact=False)).to_be_visible()
    page.get_by_role("button", name="Potrzebuję wskazówki", exact=False).click()
    page.get_by_label("Twoja odpowiedź", exact=True).fill("0,5")
    page.get_by_role("button", name="Sprawdź", exact=True).click()
    expect(page.get_by_role("heading", name="Tak, to poprawny wynik.")).to_be_visible()
    page.screenshot(path=str(OUTPUT / "puzzle-desktop.png"), full_page=True)
    page.get_by_role("button", name="Idź dalej", exact=True).click()

    # Reload while a draft is unfinished, then solve independently.
    page.get_by_label("Twoja odpowiedź", exact=True).fill("18")
    page.reload()
    page.get_by_role("button", name="Kontynuuj przygodę", exact=True).click()
    expect(page.get_by_label("Twoja odpowiedź", exact=True)).to_have_value("18")
    page.get_by_role("button", name="Sprawdź", exact=True).click()
    page.get_by_role("button", name="Idź dalej", exact=True).click()
    page.get_by_label("Twoja odpowiedź", exact=True).fill("5,00")
    page.get_by_label("Korzystałam z pomocy poza aplikacją").check()
    page.get_by_role("button", name="Sprawdź", exact=True).click()
    page.get_by_role("button", name="Idź dalej", exact=True).click()

    # Full solution may advance the story, but cannot count as independent success.
    page.get_by_role("button", name="Potrzebuję wskazówki", exact=False).click()
    page.get_by_role("button", name="Pokaż pierwszy krok", exact=False).click()
    page.get_by_role("button", name="Pokaż pełne rozwiązanie", exact=False).click()
    page.get_by_role("button", name="Rozumiem omówienie", exact=False).click()
    page.get_by_role("button", name="Zobacz dziennik odkryć", exact=True).click()
    expect(page.locator(".report-stats > div").nth(1).locator("strong")).to_have_text("1")
    expect(page.get_by_text("Po omówieniu", exact=True)).to_be_visible()

    page.get_by_role("button", name="Dla rodzica", exact=True).click()
    page.get_by_label("Ocena zapisu — Mapa w kawałkach").select_option("1")
    page.get_by_label("Ocena zapisu — Światło dla wędrowców").select_option("2")
    expect(page.get_by_text("Punkty za sprawdzone zapisy: 3/4.", exact=False)).to_be_visible()

    # Print styles must not leak solutions onto a student worksheet.
    page.emulate_media(media="print")
    expect(page.locator(".worksheet")).to_be_visible()
    expect(page.locator(".parent-report")).not_to_be_visible()
    expect(page.locator(".worksheet-task")).to_have_count(4)
    page.screenshot(path=str(OUTPUT / "worksheet-print.png"), full_page=True)
    page.emulate_media(media="screen")
    page.get_by_label("Co wydrukować?").select_option("report")
    page.emulate_media(media="print")
    expect(page.locator(".worksheet")).not_to_be_visible()
    expect(page.locator(".parent-report")).to_be_visible()
    page.emulate_media(media="screen")

    # Actual browser download; invalid JSON must leave the current state intact.
    page.get_by_role("button", name="Kopia postępu", exact=True).click()
    with page.expect_download() as download_event:
        page.get_by_role("button", name="Pobierz kopię", exact=True).click()
    backup = Path(download_event.value.path()).read_text()
    assert json.loads(backup)["tasks"]["mapa"]["parentPoints"] == 1
    before = stored(page)
    upload(page, "{invalid")
    expect(page.get_by_role("status")).to_contain_text("To nie jest zgodna kopia")
    assert stored(page) == before
    incompatible = json.loads(backup)
    incompatible["version"] = 999
    upload(page, json.dumps(incompatible))
    expect(page.get_by_role("status")).to_contain_text("To nie jest zgodna kopia")
    assert stored(page) == before

    # Restore on another device/profile, with preview and cancellation first.
    new_context = browser.new_context(viewport={"width": 1280, "height": 900})
    new_page = new_context.new_page()
    new_page.goto(URL)
    new_page.wait_for_load_state("networkidle")
    upload(new_page, backup)
    expect(new_page.get_by_role("dialog")).to_be_visible()
    assert json.loads(stored(new_page))["tasks"]["mapa"]["completion"] is None
    new_page.get_by_role("button", name="Anuluj", exact=True).click()
    expect(new_page.get_by_role("dialog")).to_have_count(0)
    upload(new_page, backup)
    new_page.get_by_role("button", name="Zastąp postęp kopią", exact=True).click()
    expect(new_page.get_by_role("heading", name="Dziennik odkryć", exact=True)).to_be_visible()
    restored = json.loads(stored(new_page))
    assert restored["tasks"] == json.loads(backup)["tasks"]
    new_page.reload()
    new_page.get_by_role("button", name="Dla rodzica", exact=True).click()
    expect(new_page.get_by_label("Ocena zapisu — Mapa w kawałkach")).to_have_value("1")

    # Conflicting tabs should pause writes rather than silently replace newer work.
    second_tab = new_context.new_page()
    second_tab.goto(URL)
    second_tab.wait_for_load_state("networkidle")
    second_tab.evaluate("key => localStorage.removeItem(key)", KEY)
    expect(new_page.get_by_role("alert")).to_contain_text("Zapis zmienił się w innej karcie")
    assert stored(new_page) is None
    new_context.close()

    # Corrupt local state is preserved rather than overwritten with a blank save.
    corrupt_context = browser.new_context()
    corrupt_context.add_init_script(f"localStorage.setItem('{KEY}', '{{corrupt');")
    corrupt_page = corrupt_context.new_page()
    corrupt_page.goto(URL)
    expect(corrupt_page.get_by_role("alert")).to_contain_text("Poprzednie dane nie zostały nadpisane")
    assert stored(corrupt_page) == "{corrupt"
    corrupt_context.close()

    # Storage quota/privacy errors are visible, while in-memory play remains available.
    blocked_context = browser.new_context()
    blocked_context.add_init_script("Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };")
    blocked_page = blocked_context.new_page()
    blocked_page.goto(URL)
    expect(blocked_page.get_by_role("alert")).to_contain_text("Nie udało się zapisać zmian")
    blocked_page.get_by_role("button", name="Otwórz archiwum", exact=True).click()
    expect(blocked_page.get_by_role("heading", name="Mapa w kawałkach", exact=True)).to_be_visible()
    blocked_context.close()

    # Small viewport, real interactive controls and keyboard navigation.
    mobile = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    mobile_page = mobile.new_page()
    mobile_page.goto(URL)
    mobile_page.wait_for_load_state("networkidle")
    assert mobile_page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    mobile_page.screenshot(path=str(OUTPUT / "home-mobile.png"), full_page=True)
    mobile_page.get_by_role("button", name="Otwórz archiwum", exact=True).click()
    expect(mobile_page.locator(".katex")).to_be_visible()
    mobile_page.get_by_label("Twoja odpowiedź", exact=True).fill("4/8")
    mobile_page.get_by_label("Twoja odpowiedź", exact=True).press("Enter")
    expect(mobile_page.get_by_role("heading", name="Tak, to poprawny wynik.")).to_be_visible()
    assert mobile_page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    mobile_page.screenshot(path=str(OUTPUT / "puzzle-mobile.png"), full_page=True)
    mobile.close()
    assert not errors, errors
    print(f"PASS: adventure, assistance, reload, parent scores, print, backups, corrupt storage, multiple tabs, mobile. Browser: {browser.version}")
    context.close()
    browser.close()
