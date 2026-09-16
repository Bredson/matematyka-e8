"""Pilot E2E: python tests/browser_smoke.py [http://127.0.0.1:5173].

Uses isolated profiles and a simulated clock; never edits real student data.
Requires Python Playwright + Chromium. Screenshots go to ignored test-results/.
"""
import json
from datetime import datetime, timezone
from pathlib import Path
import sys
from playwright.sync_api import expect, sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5173"
KEY = "kocie-archiwum.progress.v2"
OLD_KEY = "kocie-archiwum.progress.v1"
OUTPUT = Path(__file__).resolve().parent.parent / "test-results"
OUTPUT.mkdir(exist_ok=True)


def stored(page):
    return page.evaluate("key => localStorage.getItem(key)", KEY)


def upload(page, contents):
    page.get_by_label("Plik kopii postępu").set_input_files({
        "name": "kopia.json", "mimeType": "application/json", "buffer": contents.encode(),
    })


def start(page, title):
    page.get_by_role("button", name="Pilot", exact=True).click()
    page.get_by_role("button", name=f"Rozpocznij: {title}", exact=True).click()


def answer(page, value, diagnostic=False, last=False):
    if value is None:
        page.get_by_role("button", name="Nie wiem — pomiń zadanie", exact=True).click()
    else:
        page.get_by_label("Twoja odpowiedź", exact=True).fill(value)
        page.get_by_role("button", name="Zatwierdź odpowiedź" if diagnostic else "Sprawdź", exact=True).click()
    page.get_by_role("button", name="Podsumuj sesję" if last else "Idź dalej", exact=True).click()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []
    context = browser.new_context(viewport={"width": 1440, "height": 1050})
    page = context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.clock.install(time=datetime(2026, 10, 1, 12, tzinfo=timezone.utc))
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="Twoje pierwsze dwa tygodnie")).to_be_visible()
    expect(page.locator(".session-card")).to_have_count(8)
    expect(page.get_by_role("button", name="Rozpocznij: Powrót do ułamków i zakupów", exact=True)).to_be_disabled()
    page.screenshot(path=str(OUTPUT / "pilot-desktop.png"), full_page=True)

    # Delayed review prompts must also stay hidden in parent view and print.
    page.get_by_role("button", name="Dla rodzica", exact=True).click()
    page.get_by_label("Wybierz sesję", exact=True).select_option("powrot-1")
    expect(page.get_by_text("Polecenia i karta pracy pojawią się", exact=False)).to_be_visible()
    expect(page.get_by_text("Oblicz 7/15 + 1/6.", exact=False)).to_have_count(0)
    page.emulate_media(media="print")
    expect(page.locator(".worksheet-task")).to_have_count(0)
    page.emulate_media(media="screen")
    page.get_by_role("button", name="Pilot", exact=True).click()

    # Diagnostic: one attempt, skip, draft recovery, no early feedback or parent key.
    page.get_by_role("button", name="Rozpocznij pilot", exact=True).click()
    page.get_by_label("Twoja odpowiedź", exact=True).fill("1/0")
    page.get_by_role("button", name="Zatwierdź odpowiedź", exact=True).click()
    expect(page.get_by_text("Mianownik nie może być zerem.", exact=False)).to_be_visible()
    assert len(json.loads(stored(page))["tasks"]["diagnoza-a-ulamki"]["attempts"]) == 0
    page.get_by_label("Twoja odpowiedź", exact=True).fill("0")
    page.get_by_role("button", name="Zatwierdź odpowiedź", exact=True).click()
    expect(page.get_by_role("button", name="Przyjęto", exact=True)).to_be_disabled()
    expect(page.get_by_text("To jeszcze nie ten wynik.", exact=False)).to_have_count(0)
    expect(page.get_by_role("button", name="Potrzebuję wskazówki", exact=False)).to_have_count(0)
    expect(page.get_by_text("Porównaj z rozwiązaniem", exact=True)).to_have_count(0)
    page.get_by_role("button", name="Idź dalej", exact=True).click()
    answer(page, None, diagnostic=True)
    page.get_by_label("Twoja odpowiedź", exact=True).fill("4")
    page.reload()
    page.get_by_role("button", name="Kontynuuj pilot", exact=True).click()
    expect(page.get_by_label("Twoja odpowiedź", exact=True)).to_have_value("4")
    for index, value in enumerate(["4", "7", "136", "15"]):
        answer(page, value, diagnostic=True, last=index == 3)
    page.get_by_role("button", name="Dla rodzica", exact=True).click()
    expect(page.get_by_role("heading", name="Rozwiązanie", exact=True)).to_have_count(0)
    expect(page.get_by_text("Klucz i oceny pojawią się", exact=False)).to_be_visible()
    page.emulate_media(media="print")
    expect(page.locator(".worksheet-task")).to_have_count(6)
    expect(page.locator(".parent-report")).not_to_be_visible()
    page.emulate_media(media="screen")
    page.get_by_role("button", name="Dziennik", exact=True).click()
    expect(page.get_by_text("Do wyjaśnienia", exact=True)).to_have_count(0)

    start(page, "Punkt startu · część B")
    for index, value in enumerate(["32", "60", "8", "3/10", "21", "-18"]):
        if index == 2:
            page.get_by_label("Korzystałam z pomocy poza aplikacją").check()
        answer(page, value, diagnostic=True, last=index == 5)
    page.get_by_role("button", name="Zobacz dziennik odkryć", exact=True).click()
    expect(page.get_by_text("9 z 12 odpowiedzi poprawnych bez zadeklarowanej pomocy.", exact=True)).to_be_visible()
    page.screenshot(path=str(OUTPUT / "diagnosis-results.png"), full_page=True)
    page.get_by_role("button", name="Dla rodzica", exact=True).click()
    page.get_by_label("Wybierz sesję", exact=True).select_option("diagnoza-a")
    expect(page.get_by_role("heading", name="Rozwiązanie", exact=True)).to_have_count(6)
    page.get_by_label("Ocena zapisu — Różnica ułamków").select_option("1")

    # Original prologue: help recorded; independence uses first attempts, not final answers.
    start(page, "Tajemnica zaginionej strony")
    expect(page.locator(".katex")).to_be_visible()
    page.get_by_label("Twoja odpowiedź", exact=True).fill("0,25")
    page.get_by_role("button", name="Sprawdź", exact=True).click()
    expect(page.get_by_text("To jeszcze nie ten wynik.", exact=False)).to_be_visible()
    page.get_by_role("button", name="Potrzebuję wskazówki", exact=False).click()
    for index, value in enumerate(["0,5", "18", "5,00", "8/12"]):
        answer(page, value, last=index == 3)
    page.get_by_label("Ile minut zajęła sesja?").fill("29")
    page.get_by_label("Trudność", exact=True).select_option("right")
    page.get_by_label("Chcę wrócić do kolejnej sesji", exact=True).select_option("yes")
    page.get_by_label("Co pomogło, a co warto zmienić?", exact=True).fill("Wskazówka pomogła. Chcę więcej kotów.")
    page.get_by_role("button", name="Pilot", exact=True).click()
    expect(page.get_by_role("button", name="Rozpocznij: Powrót do ułamków i zakupów", exact=True)).to_be_disabled()
    expect(page.get_by_text("Powtórka dostępna od 2026-10-04.", exact=True)).to_be_visible()
    before_date_change = stored(page)
    page.get_by_label("Początek pilota", exact=True).fill("20260-10-01")
    expect(page.get_by_role("status")).to_contain_text("Nie zmieniono daty")
    assert stored(page) == before_date_change
    page.reload()
    expect(page.get_by_role("alert")).to_have_count(0)
    assert json.loads(stored(page))["sessions"]["prolog"]["reflection"]["minutes"] == 29

    # Full solution advances a practice session without fabricating a correct answer.
    start(page, "Dwa odbicia księżyca")
    page.get_by_role("button", name="Potrzebuję wskazówki", exact=False).click()
    page.get_by_role("button", name="Pokaż pierwszy krok", exact=False).click()
    page.get_by_role("button", name="Pokaż pełne rozwiązanie", exact=False).click()
    page.get_by_role("button", name="Rozumiem omówienie", exact=False).click()
    page.get_by_role("button", name="Idź dalej", exact=True).click()
    for index, value in enumerate(["2", "0,45", "8/15"]):
        answer(page, value, last=index == 2)
    start(page, "Ogród w chmurach")
    for index, value in enumerate(["12", "66", "930", "-3"]):
        answer(page, value, last=index == 3)

    # Calendar boundary: advancing the simulated clock makes delayed reviews available.
    page.clock.set_system_time(datetime(2026, 10, 4, 12, tzinfo=timezone.utc))
    page.reload()
    for title, values in [
        ("Powrót do ułamków i zakupów", ["19/30", "17", "2,05"]),
        ("Powrót do różnic i znaków", ["19/60", "3", "0,7"]),
        ("Co potrafię przenieść dalej?", ["26", "108", "0,45", "425"]),
    ]:
        start(page, title)
        for index, value in enumerate(values):
            answer(page, value, last=index == len(values) - 1)
    saved = json.loads(stored(page))
    assert sum(bool(task["completion"]) for task in saved["tasks"].values()) == 34
    assert saved["sessions"]["prolog"]["reflection"]["minutes"] == 29
    assert saved["tasks"]["lustra-zaslony"]["completion"] == "reviewed"
    assert len(saved["tasks"]["lustra-zaslony"]["attempts"]) == 0

    # Both print modes and actual backup download.
    page.get_by_role("button", name="Dla rodzica", exact=True).click()
    page.get_by_label("Ocena zapisu — Dwie części pojemności").select_option("2")
    page.emulate_media(media="print")
    expect(page.locator(".worksheet")).to_be_visible()
    expect(page.locator(".parent-report")).not_to_be_visible()
    expect(page.locator(".worksheet-task")).to_have_count(4)
    page.screenshot(path=str(OUTPUT / "pilot-worksheet.png"), full_page=True)
    page.emulate_media(media="screen")
    page.get_by_label("Co wydrukować?").select_option("report")
    page.emulate_media(media="print")
    expect(page.locator(".worksheet")).not_to_be_visible()
    expect(page.locator(".parent-report")).to_be_visible()
    page.emulate_media(media="screen")
    page.get_by_role("button", name="Kopia postępu", exact=True).click()
    with page.expect_download() as download_event:
        page.get_by_role("button", name="Pobierz kopię", exact=True).click()
    backup = Path(download_event.value.path()).read_text()
    before = stored(page)
    upload(page, "{invalid")
    expect(page.get_by_role("status")).to_contain_text("To nie jest zgodna kopia")
    assert stored(page) == before
    incompatible = json.loads(backup)
    incompatible["version"] = 999
    upload(page, json.dumps(incompatible))
    expect(page.get_by_role("status")).to_contain_text("To nie jest zgodna kopia")
    assert stored(page) == before

    new_context = browser.new_context()
    new_page = new_context.new_page()
    new_page.goto(URL)
    new_page.wait_for_load_state("networkidle")
    upload(new_page, backup)
    expect(new_page.get_by_role("dialog")).to_be_visible()
    assert json.loads(stored(new_page))["tasks"]["mapa"]["completion"] is None
    new_page.get_by_role("button", name="Anuluj", exact=True).click()
    upload(new_page, backup)
    new_page.get_by_role("button", name="Zastąp postęp kopią", exact=True).click()
    expect(new_page.get_by_role("heading", name="Dziennik odkryć", exact=True)).to_be_visible()
    restored = json.loads(stored(new_page))
    assert restored["tasks"] == json.loads(backup)["tasks"]
    assert restored["sessions"] == json.loads(backup)["sessions"]
    new_page.reload()
    new_page.get_by_role("button", name="Dla rodzica", exact=True).click()
    new_page.get_by_label("Wybierz sesję", exact=True).select_option("podsumowanie")
    expect(new_page.get_by_label("Ocena zapisu — Dwie części pojemności")).to_have_value("2")
    second_tab = new_context.new_page()
    second_tab.goto(URL)
    second_tab.wait_for_load_state("networkidle")
    second_tab.evaluate("key => localStorage.removeItem(key)", KEY)
    expect(new_page.get_by_role("alert")).to_contain_text("Zapis zmienił się w innej karcie")
    new_context.close()

    # Real v1 storage migration, preserving the old raw backup and a partial draft.
    at = "2026-09-16T10:00:00.000Z"
    empty_task = {"draft": "", "attempts": [], "hintsUsed": 0, "externalHelp": False,
                  "completion": None, "completedAt": None, "parentPoints": None}
    legacy = {"version": 1, "adventureId": "archiwum-prolog-v1", "startedAt": at, "updatedAt": at,
              "tasks": {key: dict(empty_task) for key in ["mapa", "latarnie", "sklepik", "bilet"]}}
    legacy["tasks"]["mapa"] = {**empty_task, "draft": "1/2", "attempts": [{"answer": "1/2", "correct": True, "at": at}],
                                 "hintsUsed": 1, "completion": "solved", "completedAt": at, "parentPoints": 1}
    legacy["tasks"]["latarnie"]["draft"] = "18"
    legacy_json = json.dumps(legacy)
    migration_context = browser.new_context()
    migration_context.add_init_script(f"localStorage.setItem({json.dumps(OLD_KEY)}, {json.dumps(legacy_json)});")
    migration_page = migration_context.new_page()
    migration_page.goto(URL)
    migration_page.wait_for_load_state("networkidle")
    migrated = json.loads(stored(migration_page))
    assert migrated["version"] == 2 and len(migrated["tasks"]) == 34
    assert migrated["tasks"]["mapa"]["parentPoints"] == 1
    assert migrated["tasks"]["mapa"]["attempts"][0]["assisted"] is True
    assert migration_page.evaluate("key => localStorage.getItem(key)", OLD_KEY) == legacy_json
    migration_page.get_by_role("button", name="Kontynuuj: Tajemnica zaginionej strony", exact=True).click()
    expect(migration_page.get_by_label("Twoja odpowiedź", exact=True)).to_have_value("18")
    migration_context.close()

    for mode in ["corrupt", "blocked"]:
        fault_context = browser.new_context()
        fault_context.add_init_script(
            f"localStorage.setItem('{KEY}', '{{corrupt');" if mode == "corrupt" else
            "Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };"
        )
        fault_page = fault_context.new_page()
        fault_page.goto(URL)
        expect(fault_page.get_by_role("alert")).to_contain_text("Poprzednie dane nie zostały nadpisane" if mode == "corrupt" else "Nie udało się zapisać zmian")
        if mode == "corrupt":
            assert stored(fault_page) == "{corrupt"
        fault_context.close()

    mobile = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    mobile_page = mobile.new_page()
    mobile_page.goto(URL)
    mobile_page.wait_for_load_state("networkidle")
    assert mobile_page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    mobile_page.screenshot(path=str(OUTPUT / "pilot-mobile.png"), full_page=True)
    mobile_page.get_by_role("button", name="Zakres", exact=True).click()
    expect(mobile_page.locator(".curriculum-area")).to_have_count(29)
    mobile_page.locator(".curriculum-area summary").first.click()
    assert mobile_page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    mobile_page.get_by_role("button", name="Pilot", exact=True).click()
    mobile_page.get_by_role("button", name="Rozpocznij pilot", exact=True).click()
    mobile_page.get_by_label("Twoja odpowiedź", exact=True).fill("9/20")
    mobile_page.get_by_label("Twoja odpowiedź", exact=True).press("Enter")
    expect(mobile_page.get_by_role("button", name="Przyjęto", exact=True)).to_be_disabled()
    assert mobile_page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    mobile_page.screenshot(path=str(OUTPUT / "pilot-task-mobile.png"), full_page=True)
    mobile.close()
    assert not errors, errors
    print(f"PASS: all 34 tasks, diagnosis isolation, review deadlines, reflection, scores, print, v1 migration, v2 backup round-trip, corrupt storage, multi-tab, mobile. Chromium {browser.version}")
    context.close()
    browser.close()
