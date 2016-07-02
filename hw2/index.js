const express = require('express');
const scraper = require('./lib/scraper.js');

const app = express();


app.get( '/', scraper);

app.listen(3000, function () {
    console.log('Server started on port 3000!');
});