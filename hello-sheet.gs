// První funkce

function ahojSvete() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange("A1").setValue("Ahoj, Svete!");
}
// Vložení data do buňky B1
function vlozDatum() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("B1").setValue(new Date());
}
// Počet neprázdných řádků ve sloupci A
function pocetRadku() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange("A:A").getValues();
  var count = data.filter(String).length;
  sheet.getRange("C1").setValue(count);
}
// Počet znaků (bez mezer) ve sloupci A
function pocetZnakuA() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange("A:A").getValues();
  var text = data.flat().join("");
  var count = text.replace(/\s/g, "").length;
  sheet.getRange("D1").setValue(count);
}
// Nastavení hlaviček tabulky
function nastavHlavicky() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var hlavicky = [["Den v týdnu", "Datum", "Poznámka", "Svátek"]];
  sheet.getRange("A2:D2").setValues(hlavicky);
}
// Vyplnění tabulky na týden od 24.10.2025
// včetně poznámek a svátků
function vyplnTyden() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startDate = new Date(2025, 9, 24); // 9 = říjen (0-indexované, září je 8)
  var data = [];
  var dny = ["Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle", "Pondělí", "Úterý"];
  var notes = [
    "Pohoda",
    "Dřina",
    "Ještě zítra",
    "Zítra Praha",
    "Praha 'Obi 30 let Kongresové centrum + Chinasky",
    "Zase šichta",
    "Konečně volno"
  ];
  var holiday = [
    "Jaromír",
    "Zlata",
    "Andrea/Ondřejka",
    "Jonáš",
    "Václav/Václava",
    "Michal/Michael",
    "Jeroným/Jeronym/Jarolím"
  ];
  for (var i = 0; i < 7; i++) {
    var datum = new Date(startDate);
    datum.setDate(startDate.getDate() + i);
    var denVTydnu = dny[i];
    data.push([denVTydnu, datum, notes[i], holiday[i]]);
  }
  sheet.getRange("A3:D9").setValues(data);
}
// Nastavení zarovnání textu v buňkách na střed
function zarovnejTextNaStred() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1:D9").setHorizontalAlignment("center");
}
// Nastavení šířky sloupců A až D
function nastavSirkouSloupcu() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.setColumnWidths(1, 4, 150); // Sloupce A (1) až D (4), šířka 150
}
// Nastavení barvy pozadí pro první řádek (A1:D1) na světle modrou
function nastavBarvuPozadi() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1:D1").setBackground("#ADD8E6"); // Světle modrá barva
}
// Nastavení tučného písma a pozadí pro hlavičky tabulky (A2:D2)
function nastavStylHlavicek() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A2:D2").setFontWeight("bold");
  sheet.getRange("A2:D2").setFontColor("yellow");// Žluté písmo
  sheet.getRange("A2:D2").setBackground("#628ee5ff"); // Světle modrá barva
}
// Nastavení pozadí pro buňky A3 až D9
function nastavPozadiBunek() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A3:D9").setBackground("#eecbcbff"); // Světle šedá barva
}
// Spuštění všech funkcí postupně
function spustVse() {
  ahojSvete();
  vlozDatum();
  pocetRadku();
  pocetZnakuA();
  nastavHlavicky();
  vyplnTyden();
  zarovnejTextNaStred();
  nastavSirkouSloupcu();
  nastavBarvuPozadi();
  nastavStylHlavicek();
  nastavPozadiBunek();
}