const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMoreBtn = musicList.querySelector("#close");

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

// updating playing song current time according to the progress area width
progressArea.addEventListener("click", (e) => {
  let progressBarWidthVal = progressArea.clientWidth; // getting progress bar width
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressBarWidthVal) * songDuration;
  playMusic();
});

// working on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;

    default:
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);

      do {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex === randomIndex);
      musicIndex = randomIndex;
      loadMusic(musicIndex);
      playMusic();
      break;

    default:
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMoreBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// building li according to the array Music length
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i}">
 <div class="row">
   <span>${allMusic[i].name}</span>
   <p>${allMusic[i].artist}</p>
 </div>
 <audio class="${allMusic[i].src}" src="./static/songs/${allMusic[i].src}.mp3"></audio>
 <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
</li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;

    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
  });
}

// play particular song of the list
const allLiTags = ulTag.querySelectorAll("li");
for (let j = 0; j < allLiTags.length; j++) {
  if (allLiTags[j].getAttribute("li-index") == musicIndex) {
    allLiTags[j].classList.add("playing");
  }

  // adding onClick attribute in all li tags
  allLiTags[j].setAttribute("onclick", "clicked(this)");
}
