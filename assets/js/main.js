const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Boom Clap",
      singer: "Cicetone",
      path: "./assets/music/boom_clap.mp3",
      image: "./assets/img/boom_clap.png",
    },
    {
      name: "Lean On",
      singer: "DJ Snake, Major Lazer feat MØ",
      path: "./assets/music/lean_on.mp3",
      image: "./assets/img/lean_on.jpg",
    },
    {
      name: "Nevada",
      singer: "Cicetone",
      path: "./assets/music/nevada.mp3",
      image: "./assets/img/nevada.jpg",
    },
    {
      name: "New Rules",
      singer: "Dua Lipa",
      path: "./assets/music/new_rules.mp3",
      image: "./assets/img/new_rules.jpg",
    },
    {
      name: "Nothing in your eyes",
      singer: "Yanbi",
      path: "./assets/music/nothing_in_your_eyes.mp3",
      image: "./assets/img/nothing_in_your_eyes.jpg",
    },
    {
      name: "Nothing in your eyes 2",
      singer: "Yanbi X Bảo Thy",
      path: "./assets/music/nothing_in_your_eyes2.mp3",
      image: "./assets/img/nothing_in_your_eyes2.jpg",
    },
    {
      name: "One Kiss",
      singer: "Dua Lipa",
      path: "./assets/music/one_kiss.mp3",
      image: "./assets/img/one_kiss.jpg",
    },
    {
      name: "Rude",
      singer: "Dua Lipa",
      path: "./assets/music/rude.mp3",
      image: "./assets/img/rude.jpg",
    },
    {
      name: "Somebody that I use know",
      singer: "Gotye",
      path: "./assets/music/somebody_that_i_use_know.mp3",
      image: "./assets/img/somebody_that_i_use_know.png",
    },
    {
      name: "Stressed Out",
      singer: "twenty one pilots",
      path: "./assets/music/stressed_out.mp3",
      image: "./assets/img/stressed_out.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
            </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate =  cdThumb.animate([
        {
            transform: 'rotate(360deg)'
        }
    ], {
        duration: 10000,
        iterations: Infinity
    })

    cdThumbAnimate.pause()

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play()
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause()
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );

        progress.value = progressPercent;
      }
    };

    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    nextBtn.onclick = function() {
        if (_this.isRandom) {
            _this.playRandomSong();
        } else {
            _this.nextSong();
        }
        audio.play();
        _this.scrollToActiveSong();
    }

    prevBtn.onclick = function() {
        if (_this.isRandom) {
            _this.playRandomSong();
        } else {
            _this.prevSong();
        }
        audio.play();
        _this.scrollToActiveSong();
    }

    randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
    }

    repeatBtn.onclick = function (e) {
        _this.isRepeat = !_this.isRepeat;
        //_this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);
    };


    audio.onended = function () {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextBtn.click();
        }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function() {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){{
        this.currentIndex = 0
    }}
    this.loadCurrentSong()
  },
  prevSong: function() {
    this.currentIndex--
    if(this.currentIndex < 0){{
        this.currentIndex = this.songs.length - 1
    }}
    this.loadCurrentSong()
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Define Object properties
    this.defineProperties();

    //
    this.handleEvents();

    // Load first song
    this.loadCurrentSong();

    // Render playlist
    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
