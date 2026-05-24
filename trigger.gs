function onEditTrigger(e) {

  const triggerKey = '[key]';

  if (!e || !e.range) {
    return;
  }

  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();

  if (sheetName === 'Venues') {

    const editedRowNumber = range.getRow();

    if (editedRowNumber === 1) return;

    const rowData = sheet.getRange(editedRowNumber, 1, 1, 6).getValues()[0];

    const formattedRow = {
      name: rowData[0],
      category: rowData[1],
      location: rowData[2],
      address: rowData[3],
      postcode: rowData[4],
      website: rowData[5]
    };

    Logger.log(formattedRow);

    const url = 'https://philslist.co.uk/update?key=' + triggerKey;

    try {
        const response = UrlFetchApp.fetch(url);
        Logger.log(response.getContentText());
    } catch (error) {
        Logger.log("Error sending data: " + error.toString());
    }
  }
}


}
