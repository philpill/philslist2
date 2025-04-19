const { GoogleSpreadsheet } = require('google-spreadsheet')
const express = require('express');
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
            await doc.loadInfo();
            console.log(doc);
    
            const sheet = doc.sheetsByIndex[1];
            console.log(sheet.title);

            const rows = await sheet.getRows();

            rows.forEach(row => {
                let name = row.get('name');
                console.log(name);
            });

        })();
    }

    res.send('ok')
})

app.listen(port, () => {
  console.log(`philslist listening on port ${port}`)
})
