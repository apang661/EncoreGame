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
const domain = `https://localhost:3000`;
let playlist;
let currentSong;
let score = 0;
let attemptsRemaining;
var intervalId;

// Loads in saved high score
let highscore = (localStorage.getItem("highScore") == undefined) ? 0 : localStorage.getItem("highScore");
document.getElementById("highscore").textContent = "High Score: " + highscore;

// Button for playing a custom playlist
playlistBtn.addEventListener(`click`, function(e) {
    e.preventDefault();
    playlist = [];
    fetch(`/process_get?link=${playlistInput.value}`, {mode: 'no-cors'})
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
    e.preventDefault();
    playlist = [];
    fetch(`/process_get?link=https://open.spotify.com/playlist/3XM4qNNOrn2PcaiyIe8nax?si=81ef02f784c64af7`, {mode: 'no-cors'}).then((response) => {
        console.log(response);
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
    document.location.href = '/index.html'
})

// Event for entering answer
answerButton.addEventListener("click",
    function (e){
        e.preventDefault();
        if (answerButton.textContent == "Play Again?") {
            restartGame();
        } else {
        let songInput = document.querySelector(`#song-input`).value;
        fetch (`/song?guess=${songInput}&ans=${currentSong.track_name}`)
            .then(response => response.json())
            .then(bool => {
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


const startMenu = document.querySelector(`#start-menu`);
const gameScreen = document.querySelector(`#main-game`);
const lives = document.querySelector("#attempts-display");
const playlistMenu = document.querySelector(`#playlist-menu`);

function startGame() {
    // Show game screen
    document.querySelector(`#background-image2`).classList.add(`hidden`);
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
}

function continueGame() {
    document.getElementById("score-display").innerHTML = "Score: "+ score;
    document.getElementById("song-image").src = `https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999`;
    document.getElementById("title").textContent = `What's This Song?`;
    document.querySelector(`.overlay`).style.backgroundColor = `rgb(25, 20, 20, 0.7)`;
    document.querySelector(`#background-image2`).classList.add(`hidden`);
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
    document.getElementById("title").textContent = `Game Over! 😣 Play Again?`;
    document.querySelector(`#song-input`).classList.add(`hidden`);
    document.querySelector(".final-score").classList.remove('hidden');
    document.querySelector(".final-score").textContent = `Final Score: ${score}`;
    document.querySelector(`#background-image2`).classList.remove(`hidden`);
    answerButton.textContent = "Play Again?";
}

function shuffle() {
    document.getElementById('song-input').value = "";
    if (playlist.length > 0) {
        let randomIndex = Math.floor(Math.random() * playlist.length);
        currentSong = playlist[randomIndex];
        while (!currentSong.preview_mp3) {
            playlist.splice(playlist.indexOf(currentSong), 1);
            randomIndex = Math.floor(Math.random() * playlist.length);
            currentSong = playlist[randomIndex];
        }
    } else {
        gameOver();
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
    document.querySelector(`#correct`).volume = 0.3;
    document.querySelector(`#correct`).play();
}

function loseLife() {
    document.querySelector(`.overlay`).style.backgroundColor = `rgb(238,55,18,0.5)`;
    document.querySelector(`#incorrect`).volume = 0.3;
    document.querySelector(`#incorrect`).play();
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
    setTimeout(function() {
        audio.pause();
        document.querySelector("#song-image").src = 'https://www.sonicseo.com/wp-content/uploads/2020/01/GettyImages-1055219634.jpg'
        playAgain();
    }, 3000)
    if(score > highscore){
        highscore = score;
        localStorage.setItem('highScore', score);
        document.getElementById("highscore").innerHTML = "High score: " + highscore;
    }
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
