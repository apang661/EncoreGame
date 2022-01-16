const path = require(`path`);
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const song = require('./song.js');

const port = 3001;
const html = path.join(__dirname, '/public')

app.use(express.static(html));

app.get('/process_get', function (req, res) {
    // if (req)
    // response = {
    //    playlist:req.query.playlist_input
    // };
    // console.log(response);
    // res.end(JSON.stringify(response));
    console.log(req.query.link);
})
 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})