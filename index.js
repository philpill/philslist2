const { GoogleSpreadsheet } = require('google-spreadsheet')
const express = require('express');
const fs = require('fs');
require('dotenv').config();

const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/static'))

app.get('/', (req, res) => {
    
    fs.readFile('./venue.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.render('index', { 
                food: jsonData.filter(item => item.category === 'food'), 
                entertainment: jsonData.filter(item => item.category === 'entertainment') 
            });
        } catch (parseErr) {
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
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

            fs.writeFile('./venue.json', JSON.stringify(newdata), err => {
                if (err) {
                    console.error(err);
                } else {
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
