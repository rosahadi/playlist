"use strict";

// DOM elements
const wrapper = document.querySelector("#music-container");
const topBar = wrapper.querySelector(".top-bar");
const currentTimeEl = wrapper.querySelector(
  ".song-timer .current-time"
);
const musicDuration = wrapper.querySelector(
  ".song-timer .max-duration"
);
const playPauseIcon = wrapper.querySelector(
  "#play-pause-icon"
);
const trackAudio = wrapper.querySelector(
  ".progress #main-audio"
);
const progressBar = wrapper.querySelector(".progress");
const progressContainer = wrapper.querySelector(
  ".progress-container"
);
const volumeIcon = document.getElementById("volume-icon");
const musicList = wrapper.querySelector(".music-list");
const musicListUl = wrapper.querySelector(".music-list ul");
const playListIcon = wrapper.querySelector(".ph-playlist");
const closeIcon = wrapper.querySelector(
  ".music-list-header .ph-x"
);

// MusicPlayer object
const MusicPlayer = () => {
  let currentMusicIndex = 0;
  let shuffledIndex = null;
  let isPlaying = false;
  let isRepeatMode = false;

  const allMusics = [
    {
      name: "LEEONA - Do I",
      artist: "ZARA ARSHAKIAN",
      audio: "./src/assets/songs/do-i.mp3",
      img: "./src/assets/imgs/do-i.jpg",
    },
    {
      name: "Molotov Heart",
      artist: "RADIO NOWHERE",
      audio: "src/assets/songs/molotov.mp3",
      img: "./src/assets/imgs/molotov.jpg",
    },
    {
      name: "Alone",
      artist: "COLOR OUT",
      audio: "src/assets/songs/alone.mp3",
      img: "./src/assets/imgs/alone.jpg",
    },
  ];

  // Helper function to format duration
  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  // Helper function to update playing info
  const updatePlayingInfo = (index) => {
    const totalMusics = allMusics.length;
    const currentIndex =
      shuffledIndex !== null ? shuffledIndex : index;
    wrapper.querySelector(
      ".top-bar .playing-info"
    ).textContent = `PLAYING ${
      currentIndex + 1
    } OF ${totalMusics}`;
  };

  // Load music into player
  const loadMusic = (index) => {
    const music = allMusics[index];
    const musicImg = wrapper.querySelector("#music-img");
    const musicName = wrapper.querySelector(
      ".song-details .name"
    );
    const artistName = wrapper.querySelector(
      ".song-details .artist"
    );
    musicImg.src = music.img;
    musicName.textContent = music.name;
    artistName.textContent = music.artist;
    trackAudio.src = music.audio;
  };

  // Show music list
  const showMusicList = () => {
    playListIcon.addEventListener("click", () => {
      musicList.classList.add("active");
    });
  };

  // Close music list
  const closeMusicList = () => {
    closeIcon.addEventListener("click", () => {
      musicList.classList.remove("active");
    });
  };

  // Generate music list items
  const musicListItems = () => {
    const item = allMusics.map((music, i) => {
      return `<li li-index="${i}">
                <div class="row">
                  <p class="music-list-name">${music.name}</p>
                  <p class="music-list-artist">${music.artist}</p>
                </div>
                <span id="${music.audio}" class="audio-duration">3:40</span>
                <audio src="${music.audio}" class="${music.audio}"></audio>
              </li>`;
    });

    const html = item.join("");
    musicListUl.insertAdjacentHTML("beforeend", html);

    const liElements = musicListUl.querySelectorAll("li");
    liElements.forEach((li) => {
      li.addEventListener("click", (e) => {
        const index = Number(
          e.target.closest("li").getAttribute("li-index")
        );
        currentMusicIndex = index;
        musicList.classList.remove("active");
        loadMusic(currentMusicIndex);
        updatePlayingInfo(currentMusicIndex);
        playMusic();
      });
    });
  };

  // Play music
  const playMusic = () => {
    playPauseIcon.classList.add("ph-pause");
    playPauseIcon.classList.remove("ph-play");
    trackAudio.play();
    isPlaying = true;
  };

  // Pause music
  const pauseMusic = () => {
    playPauseIcon.classList.remove("ph-pause");
    playPauseIcon.classList.add("ph-play");
    trackAudio.pause();
    isPlaying = false;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  // Shuffle musics
  const shuffle = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(
        Math.random() * allMusics.length
      );
    } while (randomIndex === currentMusicIndex);

    currentMusicIndex = randomIndex;
    loadMusic(currentMusicIndex);
    updatePlayingInfo(currentMusicIndex);
    playMusic();
  };

  // Skip music
  const skipMusic = (forward = true) => {
    currentMusicIndex =
      (forward
        ? currentMusicIndex + 1
        : currentMusicIndex - 1 + allMusics.length) %
      allMusics.length;
    loadMusic(currentMusicIndex);
    updatePlayingInfo(currentMusicIndex);
    playMusic();
  };

  // Toggle repeat mode
  const toggleRepeatMode = () => {
    const repeatIcon =
      wrapper.querySelector(".repeat-icon");

    isRepeatMode = !isRepeatMode;
    if (isRepeatMode) {
      repeatIcon.classList.add("ph-repeat-once");
      repeatIcon.classList.remove("ph-repeat");
    } else {
      repeatIcon.classList.remove("ph-repeat-once");
      repeatIcon.classList.add("ph-repeat");
    }
  };

  // Setup event listeners
  const setupEventListeners = () => {
    wrapper
      .querySelector(".play-pause")
      .addEventListener("click", togglePlayPause);
    wrapper
      .querySelector(".controls .ph-skip-forward")
      .addEventListener("click", () => skipMusic(true));
    wrapper
      .querySelector(".controls .ph-skip-back")
      .addEventListener("click", () => skipMusic(false));
    wrapper
      .querySelector(".controls .ph-shuffle")
      .addEventListener("click", shuffle);
    wrapper
      .querySelector(".repeat-icon")
      .addEventListener("click", toggleRepeatMode);
  };

  // Update music time
  const updateMusicTime = () => {
    trackAudio.addEventListener("timeupdate", (e) => {
      const currentTime = e.target.currentTime;
      const duration = e.target.duration;
      currentTimeEl.textContent =
        formatDuration(currentTime);
      const percentagePlayed =
        (currentTime / duration) * 100;
      progressBar.style.width = `${percentagePlayed}%`;
    });

    trackAudio.addEventListener(
      "loadedmetadata",
      () =>
        (musicDuration.textContent = formatDuration(
          trackAudio.duration
        ))
    );

    trackAudio.addEventListener("ended", () => {
      if (isRepeatMode) {
        trackAudio.currentTime = 0;
        playMusic();
      } else {
        skipMusic(true);
      }
    });
  };

  // Setup progress bar click handler
  const setupProgressBarClickHandler = () => {
    progressContainer.addEventListener("click", (e) => {
      const progressContainerWidth =
        progressContainer.clientWidth;
      const clickPositionX = e.offsetX;
      const currentTime =
        (clickPositionX / progressContainerWidth) *
        trackAudio.duration;
      trackAudio.currentTime = currentTime;
    });
  };

  // Setup volume icon click handler
  const setupVolumeIconClickHandler = () => {
    volumeIcon.addEventListener("click", () => {
      if (trackAudio.volume !== 0) {
        trackAudio.volume = 0;
        volumeIcon.classList.add("ph-speaker-slash");
        volumeIcon.classList.remove("ph-speaker-high");
      } else {
        trackAudio.volume = 1;
        volumeIcon.classList.remove("ph-speaker-slash");
        volumeIcon.classList.add("ph-speaker-high");
      }
    });
  };

  // Initialize function
  return {
    initialize: () => {
      loadMusic(currentMusicIndex);
      updatePlayingInfo(currentMusicIndex);
      showMusicList();
      closeMusicList();
      musicListItems();
      setupEventListeners();
      updateMusicTime();
      setupProgressBarClickHandler();
      setupVolumeIconClickHandler();
    },
  };
};

// Create instance of MusicPlayer and initialize
const musicPlayer = MusicPlayer();
musicPlayer.initialize();
