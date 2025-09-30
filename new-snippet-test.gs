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
/*Napiš gs pro zobrazení dialogu se snippetem*/
/* Po načtení(a případné úpravě) úryvku (snippetu)spusť v terminálu 'clasp push' pro nahrání změn na Google Drive */
/*Nebo použij 'clasp push' a poté 'clasp open' pro nasazení změn a následné zobrazení jako webové aplikace */