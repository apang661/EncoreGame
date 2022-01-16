const path = require(`path`);
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const song = require('./song.js');

const port = 3000;
const html = path.join(__dirname, '/public')

app.use(express.static(html));

app.get('/process_get', function (req, res) {
    song.add_spotify_playlist(req.query.link, (error, response) => {
        console.log(response);
        res.send(response);
    });
})
 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})