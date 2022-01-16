const path = require(`path`);
const express = require('express');
const app = express();
const song = require('./song.js');
const stringSimilarity = require("string-similarity");

const port = 3000;
const html = path.join(__dirname, '/public')

app.use(express.static(html));

app.get('/process_get', function (req, res) {
    console.log(req.query.link);
    song.add_spotify_playlist(req.query.link, (error, response) => {
        if (error) {
            console.log(response);
            res.send(undefined);
        } else {
            console.log(response);
            res.send(response);
        }
    });
})
 
app.get('/song', function (req, res) {
    console.log(req.query.ans, req.query.guess);
    let matchingScore = stringSimilarity.compareTwoStrings(req.query.ans.toLowerCase(), req.query.guess.toLowerCase());
    // console.log(req.query.ans, req.query.guess, matchingScore);
    res.send(matchingScore > 0.75);
})
 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})