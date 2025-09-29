# Začátek s `Google Apps Script` (lokálně přes `clasp`)

Tento návod vás provede základními kroky, jak začít vyvíjet `Google Apps Script` projekt lokálně v prostředí `VS Code` pomocí nástroje `clasp`.

## 1. Instalace Node.js a `clasp`

- Stáhněte a nainstalujte Node.js z [nodejs.org](https://nodejs.org/)
- Otevřete terminál a spusťte:

  ```cli
  npm install -g @google/clasp
  ```

## 2. Přihlášení do Google účtu

- V terminálu spusťte:

  ```cli
  clasp login
  ```

- Otevře se okno prohlížeče, kde povolíte přístup.

## 3. Vytvoření nového `Google Apps Script` projektu

- V terminálu ve složce projektu spusťte:

```cli
  clasp create --title "Název projektu" --type sheets
  ```

- Typ může být `sheets`, `docs`, `forms`, `slides` nebo `standalone`.

## 4. Struktura projektu

- Po vytvoření projektu se objeví soubory:
  - `.clasp.json` – hlavní skript
  - `appsscript.json` – konfigurace projektu

## 5. Vývoj a synchronizace

- Kód pište do vytvořeného souboru `[tvuj_nazev].gs` .
- Pro nahrání změn na Google Drive použijte:

  ```cli
  clasp push
  ```

- Pro stažení změn z Drive:

  ```cli
  clasp pull
  ```

## 6. Otevření projektu v online editoru

- Pro rychlé otevření projektu v `Google Apps Script` editoru spusťte:

  ```cli
  clasp open
  ```

---

## Instalace rozšíření pro zvýraznění syntaxe v VS Code

1. Otevřete VS Code.
2. Přejděte na panel rozšíření (ikona čtverce na bočním panelu nebo klávesová zkratka `Ctrl+Shift+X`).
3. Do vyhledávacího pole zadejte `Apps Script Syntax Colors (gas) by Jaromir Ihln`. - je možné, že vám VS Code automaticky nabídne doporučené rozšíření, pro Váš pracovní prostor se souborem `.gs`.
4. Nainstalujte rozšíření od autora `Jaromir Ihln`.

## Příklad jednoduchého skriptu pro Google Sheets

Ukázka obsahuje jednoduchý skript, který nastaví hlavičky tabulky, vyplní týdenní plán, nastaví šířku sloupců, zarovná text na střed a změní barvu pozadí prvního řádku.

- prohlédněte si soubor `hello-sheet.gs` pro kompletní kód.
- Google sheets uvidíte svou tablulku, která je ale stále prázdná. Je zapotřebí vybrat v menu `Extensions` -> `Apps Script` a po potvzení 'Důvěřuji tomuto skriptu' spustit funkce jednotlivě nebo všechny najednou(poslední funkce v kódu).:
  - `ahojSvete`
  - `vlozDatum`
  - `pocetRadku`
  - `pocetZnakuA`
  - `nastavHlavicky`
  - `vyplnTyden`
  - `zarovnatNaStred`
  - `nastavSirkouSloupcu`
  - `nastavBarvuPozadi`
  - `nastavStylHlavicek`
  - `nastavPozadiBunek`
  - `spustVse`
- Po spuštění všech funkcí by měla být tabulka vyplněná a naformátovaná podle skriptu.
- Pro další úpravy kódu stačí změny provést v `VS Code` a znovu použít `clasp push` pro nahrání změn.
- Více informací a pokročilé možnosti najdete v [dokumentaci Google Apps Script](https://developers.google.com/apps-script).
- Tento návod vám poskytuje základní přehled, jak začít s vývojem `Google Apps Script` lokálně pomocí `clasp` a `VS Code`.
- Experimentujte s kódem a objevujte možnosti, které `Google Apps Script` nabízí pro automatizaci a rozšíření aplikací Google Workspace.
- Hodně štěstí při vývoji!
- Pokud máte jakékoli dotazy nebo potřebujete pomoc, neváhejte se obrátit na komunitu nebo oficiální dokumentaci.
