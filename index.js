const { GoogleSpreadsheet } = require('google-spreadsheet');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./philslist.db');
const express = require('express');
const { get } = require('http');
require('dotenv').config();

const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/static'))

app.use('/holiday', (req, res) => {
    res.render('holiday')
})

app.get('/', (req, res) => {

    createDb(db);

    getData(db).then(data => {
        res.render('index', {
            food: data.filter(item => item.category === 'food'),
            entertainment: data.filter(item => item.category === 'entertainment')
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch data from database' });
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

            newdata = getDataFromRows(rows);

            deleteDb(db);
            createDb(db);
            insertData(db, newdata);
        })();
    }

    res.send('ok')
});

function getDataFromRows(rows) {

    let data = [];

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

            data.push({
                name: name,
                category: category,
                location: location,
                address: address,
                postcode: postcode,
                website: website
            });
        }
    });

    return data;
}

function getData(db) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT * FROM venue`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    });
}

function insertData(db, data) {
    db.serialize(() => {
        const stmt = db.prepare('INSERT INTO venue VALUES (?, ?, ?, ?, ?, ?, ?)');
        for (let i = 0; i < data.length; i++) {
            stmt.run(i, data[i].name, data[i].category, data[i].location, data[i].address, data[i].postcode, data[i].website);
        }
        stmt.finalize();
    });
}

function deleteDb(db) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS venue`);
    });
}

function createDb(db) {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS venue (
                venue_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                location TEXT,
                address TEXT,
                postcode TEXT,
                website TEXT
            )
        `);
    });
}

app.listen(port, () => {
    console.log(`philslist listening on port ${port}`)
})
