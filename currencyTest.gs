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