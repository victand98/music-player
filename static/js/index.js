const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressBar = wrapper.querySelector(".progress-bar");

let musicIndex = 0;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});

// loading music function
const loadMusic = (musicIndex) => {
  musicName.innerText = allMusic[musicIndex].name;
  musicArtist.innerText = allMusic[musicIndex].artist;
  musicImg.src = `/static/images/${allMusic[musicIndex].img}.jpg`;
  mainAudio.src = `/static/songs/${allMusic[musicIndex].src}.mp3`;
};

// play music function
const playMusic = () => {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
};

// pause music function
const pauseMusic = () => {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
};

// next music function
const nextMusic = () => {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
};

// previous music function
const prevMusic = () => {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
};

// play or pause music click button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

// next music click button event
nextBtn.addEventListener("click", () => nextMusic());

// previous music click button event
prevBtn.addEventListener("click", () => prevMusic());

// updating progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;

    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}`;

  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
