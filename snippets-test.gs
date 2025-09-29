function ahojSvete() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1").setValue("Ahoj, Svete!");
}
function zarovnejTextNaStred() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1:B1").setHorizontalAlignment("center");
}