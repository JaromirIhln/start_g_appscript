function seradData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rozsah = sheet.getDataRange();
  
  // Seřadí podle sloupce A (vzestupně) a pak podle sloupce B (sestupně)
  rozsah.sort([
    {column: 1, ascending: true},   // Sloupec A vzestupně
    {column: 2, ascending: false}   // Sloupec B sestupně
  ]);
  
  SpreadsheetApp.getActiveSpreadsheet().toast('Data seřazena!', 'Hotovo', 3);
}
function filtrujData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var filtrovanaData = [];
  
  // Přidá hlavičku
  filtrovanaData.push(data[0]);
  
  // Filtruje řádky (například kde sloupec B obsahuje 'Praha')
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().includes('Praha')) {
      filtrovanaData.push(data[i]);
    }
  }
  
  // Zapíše filtrovaná data na nový list
  var novySheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Filtrovaná data');
  novySheet.getRange(1, 1, filtrovanaData.length, filtrovanaData[0].length).setValues(filtrovanaData);
  
  Logger.log('Data filtrována. Nalezeno ' + (filtrovanaData.length - 1) + ' záznamů.');
}
function praceSeSouboryNaDrive() {
    // Použij root složku nebo nahraď ID_SLOZKY skutečným ID
  var slozka = DriveApp.getRootFolder();
  var soubory = slozka.getFiles();
  
  while (soubory.hasNext()) {
    var soubor = soubory.next();
    Logger.log('Název: ' + soubor.getName() + ', ID: ' + soubor.getId());
  }
}
function vytvorCustomMenu() {
  var ui = SpreadsheetApp.getUi();
  // Vytvoření menu s podmenu včetně ikon - zkontroluj položku '🚀 Moje Nástroje'
  ui.createMenu('🚀 Moje Nástroje')
    .addItem('📊 Analýza dat', 'analyzujData')
    .addItem('📧 Pošli report', 'posliReport')
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Nastavení')
      .addItem('🔧 Konfigurace', 'otevriKonfiguraci')
      .addItem('ℹ️ O aplikaci', 'zobrazInfo'))
    .addToUi();
}
// Opravené funkce pro menu '-alert' -> 'toast'
function analyzujData() {
  SpreadsheetApp.getActiveSpreadsheet().toast('Analýza dat spuštěna!');
}
// Opravené funkce pro menu '-alert' -> 'toast'
function posliReport() {
  SpreadsheetApp.getActiveSpreadsheet().toast('Report odeslán!');
}
function podrobneLogovani() {
  var cas = new Date().toLocaleString();
  var zprava = 'Důležitá informace';
  var data = {klíč: 'hodnota', číslo: 42};
  
  Logger.log('=== LOG ' + cas + ' ===');
  Logger.log('Zpráva: ' + zprava);
  Logger.log('Data: ' + JSON.stringify(data));
  Logger.log('========================');
}
function vytvorUdalost() {
  var kalendar = CalendarApp.getDefaultCalendar();
  var nazev = 'Schůzka z Apps Script';
  var zacatek = new Date();
  zacatek.setHours(zacatek.getHours() + 1); // za hodinu
  var konec = new Date(zacatek.getTime() + (60 * 60 * 1000)); // +1 hodina
  
  kalendar.createEvent(nazev, zacatek, konec, {
    description: 'Událost vytvořená pomocí Google Apps Script',
    location: 'Online'
  });
  Logger.log('Událost vytvořena: ' + nazev);
}
function nastavCasovyTrigger() {
  // Smaže staré triggery pro tuto funkci
  var triggery = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggery.length; i++) {
    if (triggery[i].getHandlerFunction() === 'pravidelnaFunkce') {
      ScriptApp.deleteTrigger(triggery[i]);
    }
  }
  
  // Vytvoří nový trigger - každý den v 9:00
  ScriptApp.newTrigger('pravidelnaFunkce')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  Logger.log('Časový trigger nastaven.');
}

function pravidelnaFunkce() {
  Logger.log('Pravidelná funkce spuštěna: ' + new Date());
}
function posliEmail() {
  var adresat = 'priklad@email.com';
  var predmet = 'Zpráva z Google Apps Script';
  var zprava = 'Ahoj,\n\nToto je automatická zpráva.\n\nS pozdravem';
  GmailApp.sendEmail(adresat, predmet, zprava);
  Logger.log('Email odeslán na: ' + adresat);
}
function posliEmailSPrilohou() {
  var adresat = 'priklad@email.com';
  var predmet = 'Email s přílohou';
  var zprava = 'V příloze najdeš soubor z Google Drive.';
  var soubor = DriveApp.getFileById('ID_SOUBORU_NA_DRIVE');
  GmailApp.sendEmail(adresat, predmet, zprava, {
    attachments: [soubor.getBlob()]
  });
  Logger.log('Email s přílohou odeslán.');
}
function podrobneLogovani() {
  var cas = new Date().toLocaleString();
  var zprava = 'Důležitá informace';
  var data = {klíč: 'hodnota', číslo: 42};
  
  Logger.log('=== LOG ' + cas + ' ===');
  Logger.log('Zpráva: ' + zprava);
  Logger.log('Data: ' + JSON.stringify(data));
  Logger.log('========================');
}
function vytvorSlozku() {
  var nazevSlozky = 'Nová složka ' + new Date().toLocaleDateString();
  var novaSlozka = DriveApp.createFolder(nazevSlozky);
  Logger.log('Složka vytvořena: ' + novaSlozka.getName());
  Logger.log('ID složky: ' + novaSlozka.getId());
}
// spusť v terminálu 'clasp push' pro nahrání změn na Google Drive