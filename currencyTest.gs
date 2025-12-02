/**
 * Získá aktuální kurzovní lístek z CNB API (https://api.cnb.cz/cnbapi/czeonia/daily) a vypíše jej do logu.
 * Datum lze upravit v proměnné 'dateStr' (formát yyyy-MM-dd).
 */
function getCnbCurrencyRate() {
  var date = new Date();
  var dateStr = date.toISOString().slice(0, 10); // yyyy-MM-dd
  var url = 'https://api.cnb.cz/cnbapi/czeonia/daily?date=' + dateStr;
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  if (json.czeoniaDaily) {
    Logger.log('Kurzovní lístek platný pro: ' + json.czeoniaDaily.validFor);
    Logger.log('Objem v mil. CZK: ' + json.czeoniaDaily.volumeInCZKmio);
    Logger.log('Kurz: ' + json.czeoniaDaily.rate);
  } else {
    Logger.log('Kurzovní lístek nebyl nalezen pro datum: ' + dateStr);
  }
}
/**
 * Získá denní kurzovní lístek z CNB API (https://api.cnb.cz/cnbapi/exrates/daily) a vypíše všechny měny do logu.
 * Datum lze upravit v proměnné 'dateStr' (formát yyyy-MM-dd).
 * Jazyk lze změnit v proměnné 'lang' (CZ/EN).
 */
function getCnbExratesDaily() {
  var date = new Date();
  var dateStr = date.toISOString().slice(0, 10); // yyyy-MM-dd
  var lang = 'CZ'; // nebo 'EN'
  var url = 'https://api.cnb.cz/cnbapi/exrates/daily?date=' + dateStr + '&lang=' + lang;
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  if (json.rates && json.rates.length > 0) {
    Logger.log('Kurzovní lístek platný pro: ' + json.rates[0].validFor);
    json.rates.forEach(function(rate) {
      Logger.log(rate.country + ' (' + rate.currencyCode + '): ' + rate.amount + ' ' + rate.currency + ' = ' + rate.rate + ' CZK');
    });
  } else {
    Logger.log('Kurzovní lístek nebyl nalezen pro datum: ' + dateStr);
  }
}
/**
 * Získá průměrné měsíční kurzy z CNB API (https://api.cnb.cz/cnbapi/exrates/monthly-averages-year) pro zadaný rok.
 * Rok lze upravit v proměnné 'year' (výchozí je aktuální rok).
 */
function getCnbExratesAverages() {
  var year = new Date().getFullYear(); // Změň na požadovaný rok
  var url = 'https://api.cnb.cz/cnbapi/exrates/monthly-averages-year?year=' + year;
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  if (json.averages && json.averages.length > 0) {
    Logger.log('Průměrné měsíční kurzy pro rok: ' + year);
    json.averages.forEach(function(avg) {
      Logger.log(avg.month + ' ' + avg.year + ' (' + avg.currencyCode + '): ' + avg.amount + ' = ' + avg.average + ' CZK');
    });
  } else {
    Logger.log('Průměrné kurzy nebyly nalezeny pro rok: ' + year);
  }
}
/**
 * Vytvoří Google Sheet 'MonthlyCoast' s ukázkovými výdaji za aktuální měsíc.
 * Sloupce: Datum, Typ výdaje, Částka, Poznámka, Hotovo
 */
function vytvorMonthlyCoastSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('MonthlyCoast');
  if (!sheet) sheet = ss.insertSheet('MonthlyCoast');
  else sheet.clear();
  var hlavicky = [['Datum', 'Typ výdaje', 'Částka', 'Poznámka', 'Hotovo']];
  var data = [
    ['2025-12-01', 'Nákupy', 1678, 'Penny', 'ano'],
    ['2025-12-01', 'Nájem', 13854, 'Sever', 'ano'],
    ['2025-12-02', 'Internet', 499, 'UPC', 'ne'],
    ['2025-12-03', 'Elektřina', 1200, 'ČEZ', 'ano'],
    ['2025-12-05', 'Doprava', 320, 'MHD', 'ne']
  ];
  sheet.getRange(1, 1, 1, hlavicky[0].length).setValues(hlavicky);
  sheet.getRange(2, 1, data.length, hlavicky[0].length).setValues(data);
  sheet.autoResizeColumns(1, hlavicky[0].length);
  Logger.log('✅ Sheet MonthlyCoast s výdaji vytvořen!');
}
/**
 * Vypíše do Google Sheet 'MonthlyCoast' souhrn: celkový příjem, aktuální výdaje, rozdíl a porovnání s předchozím měsícem.
 * Ukázková data: příjem 25000 Kč, výdaje 17351 Kč, předchozí výdaje 16200 Kč.
 */
function createMonthlySummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('MonthlyCoast');
  if (!sheet) { Logger.log('Sheet MonthlyCoast neexistuje!'); return; }
  var lastRow = sheet.getLastRow();
  var summaryRow = lastRow + 2;
  var prijem = 25000; // ukázkový příjem
  var vydaje = 17351; // ukázkové výdaje (můžeš nahradit součtem z tabulky)
  var predchoziVydaje = 16200; // ukázkové výdaje za minulý měsíc
  var rozdil = prijem - vydaje;
  var mezimesicniZmena = vydaje - predchoziVydaje;
  sheet.getRange(summaryRow, 1, 1, 5).setValues([[
    '', 'Souhrn', '', '', ''
  ]]);
  sheet.getRange(summaryRow + 1, 1, 1, 5).setValues([[
    '', 'Celkový příjem', prijem, '', ''
  ]]);
  sheet.getRange(summaryRow + 2, 1, 1, 5).setValues([[
    '', 'Aktuální výdaje', vydaje, '', ''
  ]]);
  sheet.getRange(summaryRow + 3, 1, 1, 5).setValues([[
    '', 'Rozdíl', rozdil, '', ''
  ]]);
  sheet.getRange(summaryRow + 4, 1, 1, 5).setValues([[
    '', 'Výdaje minulý měsíc', predchoziVydaje, '', ''
  ]]);
  sheet.getRange(summaryRow + 5, 1, 1, 5).setValues([[
    '', 'Meziroční změna', mezimesicniZmena, '', ''
  ]]);
  Logger.log('✅ Souhrn příjmů a výdajů zapsán!');
}