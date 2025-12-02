/**
 * 📅 Vytvoří pracovní kalendář s rozsahy a analýzou odpracovaných hodin
 * Automaticky počítá týdenní a měsíční fondy, přesčasy a nedodělky
 */
function vytvorPracovniKalendar() {
  // Vytvoření rozsahů pro pracovní dny - Od, Do, Pauza
  vytvorRozsahy();
 Logger.log('📅 Pracovní tabulka s rozsahy vytvořena.');
 // Vytvoření kalendáře pro aktuální měsíc
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Vytvoří nový sheet nebo vyčistí současný
  var sheet;
  try {
    sheet = ss.getSheetByName('Kalendář');
    if (sheet) sheet.clear(); // Vyčistí existující
    else sheet = ss.insertSheet('Kalendář'); // Vytvoří nový
  } catch(e) {
    sheet = ss.getActiveSheet();
    sheet.clear(); // Fallback - vyčistí aktivní sheet
  }
  
  // Nastavení hlaviček
  var hlavicky = [
    ['Datum', 'Den', 'Od', 'Do', 'Pauza (min)', 'Odprac. hodiny', 'Týdenní fond', 'Měsíční fond', 'Poznámka']
  ];
  sheet.getRange('A1:I1').setValues(hlavicky);
  
  // Formátování hlaviček
  sheet.getRange('A1:I1').setBackground('#4285F4').setFontColor('white').setFontWeight('bold');
  
  // Vytvoření kalendáře pro aktuální měsíc
  var dnes = new Date();
  var prvniDen = new Date(dnes.getFullYear(), dnes.getMonth(), 1);
  var posledniDen = new Date(dnes.getFullYear(), dnes.getMonth() + 1, 0);
  
  var radek = 2;
  var aktualniDen = new Date(prvniDen);
  
  while (aktualniDen <= posledniDen) {
    var denVTydnu = aktualniDen.getDay();
    var nazevDne = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][denVTydnu];
    
    sheet.getRange(radek, 1).setValue(new Date(aktualniDen));
    sheet.getRange(radek, 2).setValue(nazevDne);
    // Sloupce Od, Do, Pauza prázdné
    sheet.getRange(radek, 3).setValue("");
    sheet.getRange(radek, 4).setValue("");
    sheet.getRange(radek, 5).setValue("");
    // Barvení víkendů
    if (denVTydnu === 6) { // Sobota
      sheet.getRange(radek, 1, 1, 9).setBackground('#E3F2FD');
    } else if (denVTydnu === 0) { // Neděle
      sheet.getRange(radek, 1, 1, 9).setBackground('#FFEBEE');
    }
    if (denVTydnu !== 0 && denVTydnu !== 6) {
      // Pracovní den: vzorec a fondy
      var formuleHodiny = '= D' + radek + ' - C' + radek + ' - E' + radek;
      sheet.getRange(radek, 6).setFormula(formuleHodiny);
      sheet.getRange(radek, 7).setValue('40:00');
      // Měsíční fond se počítá na konci měsíce
      var pracovniDnyVMesici = spocitejPracovniDny(prvniDen, posledniDen);
      sheet.getRange(radek, 8).setValue((pracovniDnyVMesici * 8) + ':00');
    } else {
      // Víkend: vše ostatní prázdné, uživatel může ručně vyplnit přesčas
      sheet.getRange(radek, 6).setValue("");
      sheet.getRange(radek, 7).setValue("");
      sheet.getRange(radek, 8).setValue("");
    }
    sheet.getRange(radek, 9).setValue("");
    radek++;
    aktualniDen.setDate(aktualniDen.getDate() + 1);
  Logger.log('📅 Naplnění dny ve formátu: ' + aktualniDen.toLocaleDateString() + ' Nastavuji formátování sloupců s časy');
  }
  
  // Formátování
  sheet.getRange('A:A').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('C:D').setNumberFormat('hh:mm');
  sheet.getRange('F:H').setNumberFormat('[h]:mm');
  
  Logger.log('📅 Nastavuji automatickou šířku na všechny sloupce - na sloupce s časy aplikuji šířku 90px;');
  // Automatické přizpůsobení sloupců
  sheet.autoResizeColumns(1, 9);
  sheet.setColumnWidth(3, 90); // Od
  sheet.setColumnWidth(4, 90); // Do
  sheet.setColumnWidth(5, 90); // Pauza
  
  Logger.log('✅ Pracovní kalendář vytvořen! Nyní přidám rozsahy pro pracovní dny.');
  // Nastavení rozbalovacích nabídek pro Od, Do, Pauza v kalendáři
  var rozsahySheet = ss.getSheetByName('Rozsahy');
  if (rozsahySheet) {
    var odRozsah = rozsahySheet.getRange('A2:A' + rozsahySheet.getLastRow());
    var doRozsah = rozsahySheet.getRange('B2:B' + rozsahySheet.getLastRow());
    var pauzaRozsah = rozsahySheet.getRange('C2:C' + rozsahySheet.getLastRow());
    
    var posledniRadek = sheet.getLastRow();
    var odValidation = SpreadsheetApp.newDataValidation().requireValueInRange(odRozsah).setAllowInvalid(false).build();
    var doValidation = SpreadsheetApp.newDataValidation().requireValueInRange(doRozsah).setAllowInvalid(false).build();
    var pauzaValidation = SpreadsheetApp.newDataValidation().requireValueInRange(pauzaRozsah).setAllowInvalid(false).build();
    
    sheet.getRange(2, 3, posledniRadek - 1).setDataValidation(odValidation); // Sloupec C - Od
    sheet.getRange(2, 4, posledniRadek - 1).setDataValidation(doValidation); // Sloupec D - Do
    sheet.getRange(2, 5, posledniRadek - 1).setDataValidation(pauzaValidation); // Sloupec E - Pauza
    Logger.log('✅ Rozsahy pro Od, Do, Pauza přidány.');
  } else {
    Logger.log('❌ List Rozsahy nenalezen! Nejprve spusť funkci vytvorRozsahy().');
    SpreadsheetApp.getActiveSpreadsheet().toast('List Rozsahy nenalezen! Nejprve spusť funkci vytvorRozsahy().', 'Chyba', 5);
  }
}

function spocitejPracovniDny(odDatum, doDatum) {
  var pocet = 0;
  for (var d = new Date(odDatum); d <= doDatum; d.setDate(d.getDate() + 1)) {
    var den = d.getDay();
    if (den !== 0 && den !== 6) pocet++;
  }
  return pocet;
}
/**
 * 💾 Export pracovního kalendáře do různých formátů
 * PDF report, CSV export, email report
 */
function exportPracovniKalendar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  var odpoved = ui.alert('Export kalendáře', 
    'Jaký typ exportu chcete?\n\n1. PDF Report\n2. CSV Export\n3. Email Report', 
    ui.ButtonSet.YES_NO_CANCEL);
  
  switch(odpoved) {
    case ui.Button.YES:
      exportToPDF();
      break;
    case ui.Button.NO:
      exportToCSV();
      break;
    case ui.Button.CANCEL:
      sendEmailReport();
      break;
  }
}

function exportToPDF() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Vytvoření PDF URL
  var url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=pdf&gid=' + sheet.getSheetId();
  
  var response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  var blob = response.getBlob().setName('Pracovni_kalendar_' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM') + '.pdf');
  
  // Uložení do Drive
  var file = DriveApp.createFile(blob);
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ PDF export: ' + file.getName());
}

function exportToCSV() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var csv = '';
  for (var i = 0; i < data.length; i++) {
    csv += data[i].join(',') + '\n';
  }
  
  var blob = Utilities.newBlob(csv, 'text/csv', 'pracovni_kalendar_' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM') + '.csv');
  var file = DriveApp.createFile(blob);
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ CSV export: ' + file.getName());
}

function sendEmailReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Získání statistik
  var data = sheet.getDataRange().getValues();
  var celkemHodin = 0;
  var pracovniDny = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][5]) {
      celkemHodin += parseFloat(data[i][5]) || 0;
      pracovniDny++;
    }
  }
  
  var prumer = celkemHodin / pracovniDny || 0;
  var mesic = Utilities.formatDate(new Date(), 'GMT+1', 'MMMM yyyy');
  
  var emailBody = `
📊 **Měsíční report odpracovaných hodin - mesic**

📈 **Statistiky:**
• Celkem odpracováno: ${celkemHodin.toFixed(2)} hodin
• Počet pracovních dnů: pracovniDny
• Průměr na den: ${prumer.toFixed(2)} hodin
• Měsíční fond: ${pracovniDny * 8} hodin
• Rozdíl: ${(celkemHodin - pracovniDny * 8).toFixed(2)} hodin

📋 Detailní přehled najdete v tabulce.

Automaticky vygenerováno: ${new Date()}
`;
  
  var email = Session.getActiveUser().getEmail();
  
  GmailApp.sendEmail(
    email,
    '📊 Měsíční report - ' + mesic,
    emailBody
  );
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Email odeslán', 'Report byl odeslán na: ' + email, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Vytvoří list 'Rozsahy' s předdefinovanými hodnotami pro Od, Do a Pauza.
 */
function vytvorRozsahy() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Rozsahy');
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet('Rozsahy');
  var hlavicky = [['Od', 'Do', 'Pauza']];
  var od = ['6:00', '6:30', '7:00'];
  var doH = ['12:00', '13:00', '14:00', '14:30', '15:00', '16:00'];
  var pauza = ['0:00', '0:10', '0:20', '0:30'];
  var maxRows = Math.max(od.length, doH.length, pauza.length);
  var data = [];
  for (var i = 0; i < maxRows; i++) {
    data.push([od[i] || '', doH[i] || '', pauza[i] || '']);
  }
  sheet.getRange(1, 1, 1, 3).setValues(hlavicky);
  sheet.getRange(2, 1, data.length, 3).setValues(data);
  sheet.getRange('A1:C1').setBackground('#4285F4').setFontColor('white').setFontWeight('bold');
  sheet.autoResizeColumns(1, 3);
  SpreadsheetApp.getActiveSpreadsheet().toast('List Rozsahy byl vytvořen!');
}
/**
 * 📊 Vytvoří pivot tabulku s analýzou odpracovaných hodin
 * Obsahuje týdenní/měsíční přehledy, grafy a statistiky
 */
function vytvorPivotAnalyzu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName('Kalendář');
  if (!dataSheet) {
    SpreadsheetApp.getActiveSpreadsheet().toast('List Kalendář nebyl nalezen!');
    return;
  }
  
  // Vytvoří nový list pro analýzu
  var analyzaSheet = ss.getSheetByName('Analýza hodin');
  if (analyzaSheet) {
    ss.deleteSheet(analyzaSheet);
  }
  analyzaSheet = ss.insertSheet('Analýza hodin');
  
  // Získání dat
  var posledniRadek = dataSheet.getLastRow();
  if (posledniRadek < 2) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Nejdřív vyplňte data v kalendáři!');
    return;
  }
  
  var data = dataSheet.getRange(1, 1, posledniRadek, 6).getValues();
  
  // Kontrola validity dat a sheetu
  if (!analyzaSheet || !data || data.length < 2) {
    SpreadsheetApp.getActiveSpreadsheet().toast('Chyba při vytváření analýzy!');
    return;
  }
  
  // Vytvoření pivot tabulky
  vytvorTydenníPrehled(analyzaSheet, data);
  vytvorMesicniPrehled(analyzaSheet, data);
  vytvorStatistiky(analyzaSheet, data);
  vytvorGrafy(analyzaSheet);
  
  // Aktivovat list s analýzou
  analyzaSheet.activate();
  
  Logger.log('📊 Pivot analýza vytvořena!');
}

function vytvorTydenníPrehled(sheet, data) {
  // Týdenní přehled
  sheet.getRange('A1').setValue('📅 TÝDENNÍ PŘEHLED');
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold').setBackground('#E3F2FD');
  
  var hlavicky = [['Týden', 'Fond (40h)', 'Odpracováno', 'Rozdíl', 'Procenta']];
  sheet.getRange('A3:E3').setValues(hlavicky);
  sheet.getRange('A3:E3').setBackground('#4285F4').setFontColor('white').setFontWeight('bold');
  
  // Výpočet týdenních součtů
  var tydny = {};
  for (var i = 1; i < data.length; i++) {
    try {
      var datum = data[i][0];
      var den = data[i][1];
      var hodiny = data[i][5];
      // Pouze pracovní dny (Po-Pá)
      if (datum && typeof datum === 'object' && hodiny && !isNaN(parseFloat(hodiny)) && ['Po','Út','St','Čt','Pá'].includes(den)) {
        var tyden = getWeekNumber(datum);
        if (!tydny[tyden]) tydny[tyden] = 0;
        tydny[tyden] += parseFloat(hodiny);
      }
    } catch(e) {
      Logger.log('Chyba při zpracování řádku ' + i + ': ' + e.message);
    }
  }
  
  var radek = 4;
  for (var tyden in tydny) {
    var odpracovano = tydny[tyden];
    var fond = 40;
    var rozdil = odpracovano - fond;
    var procenta = (odpracovano / fond * 100).toFixed(1);
    
    sheet.getRange(radek, 1).setValue('Týden ' + tyden);
    sheet.getRange(radek, 2).setValue(fond + ':00');
    sheet.getRange(radek, 3).setValue(odpracovano.toFixed(2) + 'h');
    sheet.getRange(radek, 4).setValue(rozdil.toFixed(2) + 'h');
    sheet.getRange(radek, 5).setValue(procenta + '%');
    
    // Barevné označení
    if (rozdil > 0) {
      sheet.getRange(radek, 4, 1, 2).setBackground('#C8E6C9'); // Zelená pro přesčas
    } else if (rozdil < 0) {
      sheet.getRange(radek, 4, 1, 2).setBackground('#FFCDD2'); // Červená pro nedodělek
    }
    
    radek++;
  }
}

function vytvorMesicniPrehled(sheet, data) {
  // Měsíční přehled
  sheet.getRange('G1').setValue('📊 MĚSÍČNÍ PŘEHLED');
  sheet.getRange('G1').setFontSize(14).setFontWeight('bold').setBackground('#E8F5E8');
  
  var celkemOdpracovano = 0;
  var pracovniDny = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][5]) {
      celkemOdpracovano += parseFloat(data[i][5]) || 0;
      pracovniDny++;
    }
  }
  
  var mesicniFond = pracovniDny * 8;
  var rozdil = celkemOdpracovano - mesicniFond;
  var prumer = celkemOdpracovano / pracovniDny || 0;
  
  sheet.getRange('G3').setValue('Celkem odpracováno:');
  sheet.getRange('H3').setValue(celkemOdpracovano.toFixed(2) + 'h');
  sheet.getRange('G4').setValue('Měsíční fond:');
  sheet.getRange('H4').setValue(mesicniFond + 'h');
  sheet.getRange('G5').setValue('Rozdíl:');
  sheet.getRange('H5').setValue(rozdil.toFixed(2) + 'h');
  sheet.getRange('G6').setValue('Průměr/den:');
  sheet.getRange('H6').setValue(prumer.toFixed(2) + 'h');
  
  // Barevné označení rozdílu
  if (rozdil > 0) {
    sheet.getRange('H5').setBackground('#C8E6C9').setFontWeight('bold');
  } else if (rozdil < 0) {
    sheet.getRange('H5').setBackground('#FFCDD2').setFontWeight('bold');
  }
}

function vytvorStatistiky(sheet, data) {
  // Statistiky
  sheet.getRange('A' + (sheet.getLastRow() + 3)).setValue('📈 STATISTIKY');
  sheet.getRange('A' + sheet.getLastRow()).setFontSize(14).setFontWeight('bold').setBackground('#FFF3E0');
}

function vytvorGrafy(sheet) {
  // Vytvoření grafu týdenního přehledu
  var chartRange = sheet.getRange('A3:E' + sheet.getLastRow());
  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(chartRange)
    .setPosition(10, 1, 0, 0)
    .setOption('title', '📊 Týdenní analýza odpracovaných hodin')
    .setOption('width', 600)
    .setOption('height', 400)
    .build();
  
  sheet.insertChart(chart);
}

function getWeekNumber(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  var week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
