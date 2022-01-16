const path = require(`path`);
const express = require('express');
const app = express();
const song = require('./song.js');
const stringSimilarity = require("string-similarity");

const port = process.env.PORT || 3000;
const html = path.join(__dirname, '/root');

app.use(express.static(html));

app.get('/process_get', function (req, res) {
    song.add_spotify_playlist(req.query.link, (error, response) => {
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        if (error) {
            console.log(response, `error`);
            res.send(undefined);
        } else {
            console.log(response, `success`);
            res.send(response);
        }
    });
})
 
app.get('/song', function (req, res) {
    let matchingScore = stringSimilarity.compareTwoStrings(req.query.ans.toLowerCase(), req.query.guess.toLowerCase());
    res.send(matchingScore > 0.75);
})
 

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})