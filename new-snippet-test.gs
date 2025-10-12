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

/* Projde všechny soubory ve složce na Google Drive. Defaultně root složka,*/
 /* pokud chceš procházet jinou složku, nahraď 'getFolderById(ID_SLOZKY)' skutečným ID složky */
 /* které jsi získal ve výpisu.*/
 
function praceSeSouboryNaDrive() {
  // Použij root složku, toto ti vypíše ID všech souborů, nahraď
  // 'getRootFolder() - getFolderById(ID_SLOZKY)' skutečné ID
  // která jsi právě získal ve výpisu
  var slozka = DriveApp.getRootFolder(); // nebo DriveApp.getFolderById('váš_skutečný_folder_id');
  var soubory = slozka.getFiles();
  
  while (soubory.hasNext()) {
    var soubor = soubory.next();
    Logger.log('🕵️‍♀️ Název: ' + soubor.getName() + ', ID: ' + soubor.getId());
  }
}
/** Vytvoří novou složku na Google Drive s aktuálním datem.*/
function vytvorSlozku() {
  var nazevSlozky = 'Nová složka ' + new Date().toLocaleDateString();
  var novaSlozka = DriveApp.createFolder(nazevSlozky);
  Logger.log('Složka vytvořena: ' + novaSlozka.getName());
  Logger.log('📂ID složky: ' + novaSlozka.getId());
}

 /** Seřadí data podle více sloupců s možností vzestupného/sestupného řazení.*/
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