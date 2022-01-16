
const playlistInput = document.querySelector(`#playlist-input`);
const playlistBtn = document.querySelector(`.playlist-button`);
const encoreTitleButton = document.querySelector(`#encoreTitle`);
const playBtn = document.querySelector(`.def`);
const answerButton = document.querySelector(`#answer-button`);
const NUM_GUESSES = 3;
const WIN_THRESHOLD = 10;
const LOWEST_TO_WIN = 0.75;
let playlist;
//         artist_name: 
//         track_name: 
//         track_image: 
//         preview_mp3: 
let currentSong;
let score = 0;
let attemptsRemaining;

// const http = require('http'); // or 'https' for https:// URLs
// const fs = require('fs');

// const file = fs.createWriteStream("audio2.mp3");
// const request = http.get("https://www.bensound.com/bensound-music/bensound-moose.mp3", function(response) {
//   response.pipe(file);
// });

// let wave = new CircularAudioWave(document.getElementById('background-image'));
// wave.loadAudio("audio1.mp3");

// let wave = new Wave();
// options = {type:"bars"};
// wave.fromElement("currentSong","background-image", options);


// Button setup
playlistBtn.addEventListener(`click`, function(e) {
    e.preventDefault();
    fetch(`http://localhost:3000/process_get?link=${playlistInput.value}`).then((response) => {
        playlist = response;
        playGame();
    })
});


playBtn.addEventListener("click", (e) => {
    // const audio = document.querySelector('audio');
    // audio.volume = 1;
    // audio.play();
    e.preventDefault();
    fetch(`http://localhost:3000/process_get?link=https://open.spotify.com/playlist/0wcczi2R26SZFtuuB0Iw1h?si=051303b3aff94837`).then((response) => {
        playlist = response;
        playGame();
    })
});

encoreTitleButton.addEventListener("click", (e) => {
    e.preventDefault();
    // document.location.href = '/index.html'
    console.log(`click`);
    const audio = document.querySelector('audio');
    audio.volume = 1;
    audio.play();
})



// Event for entering answer
answerButton.addEventListener(`click`, (e) => {
    e.preventDefault();
    enterAnswer();
});


// Game functions

let songInput = document.querySelector(`#song-input`);

function enterAnswer() {
    let expected = currentSong.track_name;
    if (checkAns(songInput, expected)) {
        selectNextSong();
        attemptsRemaining = NUM_GUESSES;
    } else {
        attemptsRemaining -= 1;
    }
}

// Deletes current song from the playlist and updates the current song
function selectNextSong() {}

function playGame() {

    do{
        shuffle();
        playSong();
    
        do{

        }while(attemptsRemaining > 0)

        
    }while(score < WIN_THRESHOLD + 1)
    
    // if (correct) then pop currentSong off playlist
    // else ???
}

function playAgain(){
    //ask user to play again
    
}

function checkAns(ans, key){
    var stringSimilarity = require("string-similarity");
    let matchingScore = stringSimilarity.compareTwoStrings(ans.toLowerCase(), key.toLowerCase());
    return matchingScore > LOWEST_TO_WIN;
}

function shuffle() {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    currentSong = playlist[randomIndex];
}

function showPlaylistMenu() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("playlist-menu").style.display = "block";
}

function playSong() {
    const audio = document.querySelector('audio');
    audio.src = currentSong.preview_mp3;
    audio.volume = 1;
    audio.play();
}