
const playlistInput = document.querySelector(`#playlist-input`);
const playlistBtn = document.querySelector(`.playlist-button`);
const encoreTitleButton = document.querySelector(`#encoreTitle`);
const playBtn = document.querySelector(`.def`);
const answerButton = document.querySelector(`#answer-button`);
const timer = document.querySelector(`#timer`);
const title = document.querySelector(`#title`);
const audio = document.querySelector('audio');
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
var intervalId;

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


// Button for playing a custom playlist
playlistBtn.addEventListener(`click`, function(e) {
    e.preventDefault();
    console.log(playlistInput.value);
    playlist = [];
    fetch(`http://localhost:3000/process_get?link=${playlistInput.value}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (!data) {
                alert('No playlist found')
            } else {
                playlist = data;
                startGame();
            }
    })
});

// Button for playing a default playlist
playBtn.addEventListener("click", (e) => {
    // const audio = document.querySelector('audio');
    // audio.volume = 1;
    // audio.play();
    e.preventDefault();
    playlist = [];
    fetch(`http://localhost:3000/process_get?link=https://open.spotify.com/playlist/0wcczi2R26SZFtuuB0Iw1h?si=051303b3aff94837`).then((response) => {
        return response.json();
    })
    .then((data) => {
        if (!data) {
            alert('No playlist found')
        } else {
            playlist = data;
            startGame();
        }
})
});

// Button for playing song
encoreTitleButton.addEventListener("click", (e) => {
    e.preventDefault();
    // document.location.href = '/index.html'
    console.log(`click`);
    console.log(audio.duration);
})

// Event for entering answer
answerButton.addEventListener("click",
    function (e){
        e.preventDefault();
        if (answerButton.textContent == "Play Again?") {
            restartGame();
        } else {
        let songInput = document.querySelector(`#song-input`).value;
        fetch (`http://localhost:3000/song?guess=${songInput}&ans=${currentSong.track_name}`)
            .then(response => response.json())
            .then(bool => {
                console.log(bool);
                clearInterval(intervalId);
                if (bool) {
                    setTimeout(function() {
                        continueGame();
                    }, 3000)
                    increaseScore();
                    document.querySelector(`.overlay`).style.backgroundColor = `rgb(146,208,80, 0.5)`;
                    displaySong();
                } else {
                    loseLife();
                }
            });
        }
    });


/* Game Functions */



// function enterAnswer(songInput) {
//     checkAns(songInput);
//     //     shuffle();
//     //     playSong();
//     //     attemptsRemaining = NUM_GUESSES;
//     // } else {
//     //     attemptsRemaining -= 1;
//     //     document.getElementById("attempts-display").innerHTML = attemptsRemaining + " Attempts Remaining";
//     // }
// }

const startMenu = document.querySelector(`#start-menu`);
const gameScreen = document.querySelector(`#main-game`);
const lives = document.querySelector("#attempts-display");
const playlistMenu = document.querySelector(`#playlist-menu`);

function startGame() {
    // Show game screen
    startMenu.style.display = "none";
    playlistMenu.style.display = "none";
    gameScreen.style.display = "grid";
    gameScreen.style.gridTemplateColumns = "1fr";
    
    
    attemptsRemaining = NUM_GUESSES;
    for (let i = attemptsRemaining; i > 0; i--) {
        lives.innerHTML += `<img class="life" src = "life.png">`
    }
    shuffle();
    playSong();
    console.log(currentSong);
}

function continueGame() {
    document.getElementById("score-display").innerHTML = "Score: "+ score;
    document.getElementById("song-image").src = `https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999`;
    document.getElementById("title").textContent = `What's This Song?`;
    document.querySelector(`.overlay`).style.backgroundColor = `rgb(25, 20, 20, 0.7)`;
    shuffle();
    playSong();
}

function restartGame() {
    score = 0;
    attemptsRemaining = NUM_GUESSES;
    document.querySelector(`#song-input`).classList.remove(`hidden`);
    document.querySelector(".final-score").classList.add('hidden');
    answerButton.textContent = "Enter";
    updateLifeBar();
    continueGame();
}

function playAgain(){
    //ask user to play again
    document.getElementById("title").textContent = `GameOver! 😣 Play Again?`;
    document.querySelector(`#song-input`).classList.add(`hidden`);
    document.querySelector(".final-score").classList.remove('hidden');
    document.querySelector(".final-score").textContent = `Final Score: ${score}`;
    answerButton.textContent = "Play Again?";
}

function checkAns(key){
    fetch (`http://localhost:3000/song?guess=${key}&ans=${currentSong.track_name}`)
        .then(response => response.json())
        .then(bool => console.log(bool));
}

function shuffle() {
    let randomIndex = Math.floor(Math.random() * playlist.length);
    currentSong = playlist[randomIndex];
    while (!currentSong.preview_mp3) {
        playlist.splice(playlist.indexOf(currentSong), 1);
        randomIndex = Math.floor(Math.random() * playlist.length);
        currentSong = playlist[randomIndex];
    }
}

function showPlaylistMenu() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("playlist-menu").style.display = "block";
}

function playSong() {
    timer.style.width = `0%`;
    const audio = document.querySelector('audio');
    audio.src = currentSong.preview_mp3;
    audio.volume = 0.1;
    audio.play();
    startTimer();
}

function increaseScore() {
    score += Math.floor((30-audio.currentTime)*(30-audio.currentTime));
}

function loseLife() {
    document.querySelector(`.overlay`).style.backgroundColor = `rgb(238,55,18,0.5)`;
    attemptsRemaining--;
    updateLifeBar();
    isGameOver()
}

function updateLifeBar() {
    lives.innerHTML = 'Lives: ';
    for (let i = attemptsRemaining; i > 0; i--) {
        lives.innerHTML += `<img class="life" src = "life.png">`;
    }
}

function gameOver() {
    audio.pause();
    document.querySelector("#song-image").src = 'https://www.sonicseo.com/wp-content/uploads/2020/01/GettyImages-1055219634.jpg'
    playAgain();
}

function displaySong() {
    document.getElementById("score-display").innerHTML = "Score: "+ score;
    document.getElementById("song-image").src = currentSong.track_image;
    document.getElementById("title").textContent = currentSong.track_name;
}

function startTimer() {
    let time = 15;
    intervalId = setInterval(() => {
        timer.style.width = `${((15 - time) / 15)*100}%`;
        if (!(time < 0.0001)) {
            time -= 0.01;
        } else {
            clearInterval(intervalId);
            loseLife();
        }
    }, 10);
    
}

function isGameOver() {
    displaySong();
    if (attemptsRemaining < 1) {
        gameOver();
        return true;
    } else {
        setTimeout(function () {
            continueGame();
        }, 3000);
    }
    return false;
}
