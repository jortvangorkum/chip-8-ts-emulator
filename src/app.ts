const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/roms', express.static('roms'));
app.use('/', function (req, res) { res.sendFile(path.join(__dirname, '../index.html')) })

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})