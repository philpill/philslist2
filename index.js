const { GoogleSpreadsheet } = require('google-spreadsheet')
const express = require('express');
console.log(require('dotenv').config());

const venueData = require('./venue.json');
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/static'))

app.get('/', (req, res) => {

    (async function () {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, { apiKey: process.env.GOOGLE_API_KEY });
        await doc.loadInfo();
        console.log(doc.title);
    })();

    res.render('index', { foodData: venueData.filter(item => item.category === 'food') });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
