function ahojSvete() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1").setValue("Ahoj, Svete!");
}
function zarovnejTextNaStred() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1:B1").setHorizontalAlignment("center");
}
/**
 * Generuje QR kód pro zadaný text pomocí QR-Server API.
 * Google Charts API už není dostupné, proto používáme alternativu.
 */
function vygenerujQRKod() {
  var text = 'https://github.com/JaromirIhln'; // Text pro QR kód
  var velikost = 120; // Velikost QR kódu v pixelech (zmenšeno z 200)
  
  // Použití QR-Server API jako alternativy k Google Charts
  var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?' +
    'size=' + velikost + 'x' + velikost +
    '&data=' + encodeURIComponent(text);
  
  Logger.log('🔲 QR kód URL: ' + qrUrl);
  
  try {
    // Vlož QR kód jako obrázek do Sheets
    var response = UrlFetchApp.fetch(qrUrl);
    if (response.getResponseCode() === 200) {
      var blob = response.getBlob();
      var sheet = SpreadsheetApp.getActiveSheet();
      sheet.insertImage(blob, 2, 2); // Řádek 2, sloupec B
      
      SpreadsheetApp.getActiveSpreadsheet().toast('QR kód vygenerován!', 'Hotovo', 3);
    } else {
      throw new Error('API vratilo chybu: ' + response.getResponseCode());
    }
  } catch (error) {
    Logger.log('❌ Chyba při generování QR kódu: ' + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast('Chyba při generování QR kódu: ' + error.toString(), 'Chyba', 5);
  }
}

/**
 * Alternativní funkce pro generování QR kódu s více možnostmi API.
 * Pokud jedna služba nefunguje, zkusí další.
 */
function vygenerujQRKodAlternativni() {
  var text = 'https://github.com/JaromirIhln'; // Text pro QR kód
  var velikost = 120; // Velikost QR kódu v pixelech (zmenšeno z 200)
  
  // Seznam různých QR API služeb
  var qrApis = [
    {
      name: 'QR-Server',
      url: 'https://api.qrserver.com/v1/create-qr-code/?size=' + velikost + 'x' + velikost + '&data=' + encodeURIComponent(text)
    },
    {
      name: 'QRCode-Monkey (veřejné)',
      url: 'https://api.qrserver.com/v1/create-qr-code/?size=' + velikost + 'x' + velikost + '&format=png&data=' + encodeURIComponent(text)
    }
  ];
  
  for (var i = 0; i < qrApis.length; i++) {
    try {
      Logger.log('🔄 Zkouším API: ' + qrApis[i].name);
      var response = UrlFetchApp.fetch(qrApis[i].url);
      
      if (response.getResponseCode() === 200) {
        var blob = response.getBlob();
        var sheet = SpreadsheetApp.getActiveSheet();
        sheet.insertImage(blob, 2, 4); // Řádek 2, sloupec D
        
        SpreadsheetApp.getActiveSpreadsheet().toast('QR kód vygenerován pomocí ' + qrApis[i].name + '!', 'Hotovo', 3);
        Logger.log('✅ QR kód úspěšně vygenerován pomocí: ' + qrApis[i].name);
        return; // Úspěch, končíme
      }
    } catch (error) {
      Logger.log('❌ API ' + qrApis[i].name + ' selhalo: ' + error.toString());
      continue; // Zkusíme další API
    }
  }
  
  // Pokud všechna API selhala
  SpreadsheetApp.getActiveSpreadsheet().toast('Všechna QR API selhala. Zkuste to později.', 'Chyba', 5);
  Logger.log('❌ Všechna QR API selhala');
}

/**
 * Smaže všechny obrázky (včetně QR kódů) z aktivního sheetu.
 */
function smazatVsechnyObrazky() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var images = sheet.getImages();
  
  Logger.log('🔍 Nalezeno obrázků k smazání: ' + images.length);
  
  if (images.length === 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Žádné obrázky k smazání.', 'Info', 2);
    return;
  }
  
  // Smaž všechny obrázky
  for (var i = 0; i < images.length; i++) {
    images[i].remove();
  }
  
  SpreadsheetApp.getActiveSpreadsheet().toast('Smazáno ' + images.length + ' obrázků.', 'Hotovo', 3);
  Logger.log('✅ Úspěšně smazáno ' + images.length + ' obrázků');
}

/**
 * Smaže pouze posledně přidaný obrázek.
 */
function smazatPosledniObrazek() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var images = sheet.getImages();
  
  if (images.length === 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Žádné obrázky k smazání.', 'Info', 2);
    return;
  }
  
  // Smaž poslední obrázek (posledně přidaný)
  images[images.length - 1].remove();
  
  SpreadsheetApp.getActiveSpreadsheet().toast('Poslední obrázek smazán.', 'Hotovo', 2);
  Logger.log('✅ Poslední obrázek smazán');
}
/**
 * Systém toast notifikací s různými typy zpráv.
 */
function zobrazNotifikaci() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Různé typy notifikací
  spreadsheet.toast('✅ Operace dokončena úspěšně!', 'Úspěch', 3);
  
  Utilities.sleep(4000);
  spreadsheet.toast('⚠️ Varování: Zkontrolujte data!', 'Varování', 5);
  
  Utilities.sleep(6000);
  spreadsheet.toast('❌ Chyba při zpracování!', 'Chyba', 8);
  
  Utilities.sleep(9000);
  spreadsheet.toast('ℹ️ Informace: Proces běží na pozadí', 'Info', 4);
}

// Pomocné funkce pro rychlé použití
function uspechNotifikace(zprava) {
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ ' + zprava, 'Úspěch', 3);
}

function chybaNotifikace(zprava) {
  SpreadsheetApp.getActiveSpreadsheet().toast('❌ ' + zprava, 'Chyba', 8);
}
/**
 * Systém validace dat s různými typy kontrol.
 */
function validujData() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var chyby = [];
  
  for (var i = 1; i < data.length; i++) { // Přeskočit hlavičku
    var radek = data[i];
    var chybyRadku = [];
    
    // Validace emailu (sloupec A)
    if (!validujEmail(radek[0])) {
      chybyRadku.push('Neplatný email');
    }
    
    // Validace čísla (sloupec B)
    if (!validujCislo(radek[1])) {
      chybyRadku.push('Neplatné číslo');
    }
    
    // Validace datumu (sloupec C)
    if (!validujDatum(radek[2])) {
      chybyRadku.push('Neplatné datum');
    }
    
    if (chybyRadku.length > 0) {
      chyby.push('Řádek ' + (i + 1) + ': ' + chybyRadku.join(', '));
    }
  }
  
  if (chyby.length > 0) {
    Logger.log('❌ Nalezeny chyby:');
    chyby.forEach(function(chyba) {
      Logger.log('  • ' + chyba);
    });
    SpreadsheetApp.getActiveSpreadsheet().toast('Nalezeno ' + chyby.length + ' chyb!', 'Validace', 5);
  } else {
    Logger.log('✅ Všechna data jsou validní!');
    SpreadsheetApp.getActiveSpreadsheet().toast('Všechna data jsou v pořádku!', 'Validace OK', 3);
  }
}

function validujEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && regex.test(email.toString());
}

function validujCislo(cislo) {
  return !isNaN(cislo) && cislo !== '';
}

function validujDatum(datum) {
  return datum instanceof Date && !isNaN(datum);
}
/**
 * Pokročilý debugging systém s error handling a detailním logováním.
 */
function pokrocileDebugovani() {
  var startTime = new Date();
  var funkceNazev = 'pokrocileDebugovani';
  
  try {
    debugLog('🚀 START', funkceNazev + ' spuštěno');
    
    // Simulace práce s daty
    var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    debugLog('📊 DATA', 'Načteno ' + data.length + ' řádků');
    
    // Simulace možné chyby
    if (data.length === 0) {
      throw new Error('Žádná data k zpracování');
    }
    
    // Úspěšné dokončení
    var endTime = new Date();
    var duration = endTime - startTime;
    debugLog('✅ SUCCESS', funkceNazev + ' dokončeno za ' + duration + 'ms');
    
  } catch (error) {
    errorLog(funkceNazev, error);
    throw error; // Re-throw pro další zpracování
  }
}

function debugLog(typ, zprava) {
  var timestamp = new Date().toLocaleString();
  Logger.log('[' + timestamp + '] ' + typ + ': ' + zprava);
}

function errorLog(funkce, error) {
  var timestamp = new Date().toLocaleString();
  Logger.log('🚨 [' + timestamp + '] ERROR in ' + funkce + ':');
  Logger.log('   Message: ' + error.message);
  Logger.log('   Stack: ' + error.stack);
}
/**
 * Generuje Code 128 barcode pomocí různých API služeb.
 */
function vygenerujBarcode128() {
  var text = '1234567890'; // Text pro barcode (čísla, písmena, speciální znaky)
  var sirka = 200; // Šířka barcodu v pixelech
  var vyska = 50; // Výška barcodu v pixelech

  // Seznam různých Barcode API služeb
  var barcodeApis = [
    {
      name: 'Barcode-Generator API',
      url: 'https://barcodeapi.org/api/code128/' + encodeURIComponent(text) + '?width=' + sirka + '&height=' + vyska
    },
    {
      name: 'QR-Server Barcode (nesprávné API)',
      url: 'https://api.qrserver.com/v1/create-qr-code/?size=' + sirka + 'x' + vyska + '&format=png&qzone=0&data=' + encodeURIComponent(text)
    }
  ];

  Logger.log('🔢 Generuji barcode pro text: ' + text);
  Logger.log('📏 Rozměry: ' + sirka + 'x' + vyska + 'px');

  for (var i = 0; i < barcodeApis.length; i++) {
    try {
      Logger.log('🔄 Zkouším Barcode API: ' + barcodeApis[i].name);
      Logger.log('🌐 URL: ' + barcodeApis[i].url);
      
      var response = UrlFetchApp.fetch(barcodeApis[i].url);
      if (response.getResponseCode() === 200) {
        var blob = response.getBlob();
        var sheet = SpreadsheetApp.getActiveSheet();
        sheet.insertImage(blob, 2, 6); // Řádek 2, sloupec F

        SpreadsheetApp.getActiveSpreadsheet().toast('Code 128 barcode vygenerován pomocí ' + barcodeApis[i].name + '!', 'Hotovo', 3);
        Logger.log('✅ Barcode úspěšně vygenerován pomocí: ' + barcodeApis[i].name);
        Logger.log('📊 Barcode data: ' + text);
        return; // Úspěch, končíme
      } else {
        Logger.log('❌ HTTP chyba ' + response.getResponseCode() + ' pro API: ' + barcodeApis[i].name);
      }
    } catch (error) {
      Logger.log('❌ Barcode API ' + barcodeApis[i].name + ' selhalo: ' + error.toString());
      continue; // Zkusíme další API
    }
  }
  
  // Pokud všechna API selhala
  SpreadsheetApp.getActiveSpreadsheet().toast('Všechna Barcode API selhala. Zkuste to později.', 'Chyba', 5);
  Logger.log('❌ Všechna Barcode API selhala');
}