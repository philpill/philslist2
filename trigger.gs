// triger code used in apps script

function onEditTrigger(e) {

  const triggerKey = '[key]';

  const range = e.range;
  const sheet = range.getSheet();
  const data = sheet.getDataRange().getValues();
  const formattedData = [];

  for (let row in data) {
    
    let value = data[row];
    
    //Logger.log("value = %s", value);

    // [JG Ross Inverurie, food, Inverurie, Highclere Business Park, Highclere Way, Inverurie, AB51 5QW, https://www.jg-ross.co.uk/coffee-shops]

    let formattedRow = {
      name: value[0],
      category: value[1],
      location: value[2],
      address: value[3],
      postcode: value[4],
      website: value[5]
    };

    formattedData.push(formattedRow);
  }

  // Logger.log(formattedData);
  
  const response = UrlFetchApp.fetch('https://philslist.co.uk/update?key=' + triggerKey);
  
  Logger.log(response.getContentText());
}
