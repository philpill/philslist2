const express = require('express');


const path = require('path');
const listData = require('./data.json');
const venueData = require('./venue.json');
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/static'))

app.get('/', (req, res) => {
    res.render('index', { foodData: venueData.filter(item => item.category === 'food') });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
