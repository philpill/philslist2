const { GoogleSpreadsheet } = require('google-spreadsheet')
const express = require('express');
const fs = require('fs');
console.log(require('dotenv').config());

const venueData = require('./venue.json');
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/static'))

app.get('/', (req, res) => {

    res.render('index', { foodData: venueData.filter(item => item.category === 'food') });
})

app.get('/update', (req, res) => {

    if (req.query && req.query.key && req.query.key === process.env.TRIGGER_KEY) {

        (async function () {
            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, { apiKey: process.env.GOOGLE_API_KEY });
            await doc.loadInfo(); // loads document properties and worksheets
            const sheet = doc.sheetsByIndex[1];
            const rows = await sheet.getRows();
            const newdata = [];

            rows.forEach(row => {
                let name = row.get('name');
                let category = row.get('category');
                let location = row.get('location');
                let address = row.get('address');
                let postcode = row.get('postcode');
                let website = row.get('website');

                if (name
                    && category
                    && location
                    && address
                    && postcode
                    && website) {

                        newdata.push({
                        name: name,
                        category: category,
                        location: location,
                        address: address,
                        postcode: postcode,
                        website: website
                    });
                }
            });

            console.log(newdata);

            fs.writeFile('test.json', newdata, err => {
                if (err) {
                    console.error(err);
                } else {
                    // file written successfully
                    console.log('venue.json updated successfully');
                }
            });
        })();
    }

    res.send('ok')
})

app.listen(port, () => {
  console.log(`philslist listening on port ${port}`)
})
