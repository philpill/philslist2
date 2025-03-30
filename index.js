const express = require('express');
const Transform = require("stream").Transform;
const fs = require('fs');

const path = require('path');
const listData = require('./data.json');
const app = express()
const port = 3000

const populateData = new Transform();

populateData._transform = function(data, encoding, done) {

    console.log('listData', listData);

    const arr = [];

    for (let i = 0; i < listData.length; i++) {
        arr.push(`<li>${listData[i].Location}</li>`);
    }

    const result = arr.join('');

    const str = data.toString();
    const thing = str.replace('{{ data }}', result);
    this.push(thing);
    done();
}

app.use(express.static(__dirname + '/public'));

// https://stackoverflow.com/a/66055532/3983822
app.get('/', (req, res) => {

    const file = './index.html';

    res.write('<!-- Begin stream -->\n');
    let stream = fs.createReadStream(file, { encoding: 'utf8' });
    stream.pipe(populateData)
    .on('end', () => {
        res.write('\n<!-- End stream -->')
    }).pipe(res);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
