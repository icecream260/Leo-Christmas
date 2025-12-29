document.body.classList.add("home");

let cards = [];
let leoIndex;
let chances;
let gameOver = false;
let bgAudio;
let musicOn = true;
let snowflakes = [];
let cardImages = [];

const chancesDisplay = document.querySelector(".chances");
const playButton = document.querySelector(".play-again");
const volumeButton = document.querySelector(".volume-btn");
const difficultySelect = document.getElementById("difficulty");
const photoGrid = document.querySelector(".photo-grid");

/* ================================
   PRELOAD IMAGES
================================ */
function preloadImages() {
  const paths = [
    "photos/img1.jpg",
    "photos/img2.JPEG",
    "photos/img3.JPEG",
    "photos/img4.JPEG",
    "photos/img5.PNG",
    "photos/img6.jpg",
    "photos/img7.JPEG",
    "photos/img8.JPEG",
    "photos/img9.JPEG",
    "photos/img11.JPEG",
    "photos/img12.JPEG",
    "photos/img14.jpg"
  ];

  paths.forEach(path => {
    const img = new Image();
    img.src = path;
    cardImages.push(img);
  });
}
preloadImages();

/* ================================
   SHUFFLE HELPER
================================ */
function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ================================
   INIT GAME
================================ */
function initGame() {
  const difficulty = difficultySelect.value;
  const cardCount =
    difficulty === "easy" ? 4 :
    difficulty === "medium" ? 8 : 12;

  photoGrid.className = "photo-grid " + difficulty;

  chances = 3;
  gameOver = false;
  chancesDisplay.innerHTML = `Chances: <span class="red-text"> ${chances}</span>`;

  photoGrid.innerHTML = "";
  cards = [];

  // ✅ SHUFFLE ALL IMAGES FIRST
  const shuffledImages = shuffleArray(cardImages);

  // ✅ SELECT IMAGES BASED ON DIFFICULTY
  const selectedImages = shuffledImages.slice(0, cardCount);

  // ✅ RANDOM LEO POSITION
  leoIndex = Math.floor(Math.random() * cardCount);

  for (let i = 0; i < cardCount; i++) {
    const card = document.createElement("div");
    card.className = "card";

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("img");
    front.className = "card-front";
    front.src = selectedImages[i].src;

    const back = document.createElement("img");
    back.className = "card-back";

    if (i === leoIndex) {
      back.src = "photos/img15.png";
      back.dataset.leo = "true";
    } else {
      back.src = "photos/blank.png";
    }

    inner.append(front, back);
    card.appendChild(inner);
    photoGrid.appendChild(card);
    cards.push(card);
  }

  setupClicks();

  if (!bgAudio) {
    bgAudio = new Audio("Winter Festival.mp3");
    bgAudio.loop = true;
  }

  if (musicOn && bgAudio.paused) {
    bgAudio.play();
  }
}

/* ================================
   CARD CLICKS
================================ */
function setupClicks() {
  cards.forEach(card => {
    card.onclick = () => {
      if (gameOver || card.classList.contains("flipped")) return;

      card.classList.add("flipped");
      const back = card.querySelector(".card-back");

      if (back.dataset.leo) {
        chancesDisplay.textContent = "🎄 You found the Christmas Leo Boy! 🎄";
        gameOver = true;
      } else {
        chances--;
        if (chances > 0) {
          chancesDisplay.innerHTML =
            `Chances Left: <span class="red-text"> ${chances}</span>`;
        } else {
          chancesDisplay.innerHTML =
            '<span class="red-text">Out of Chances!</span> Leo has been revealed 🎄';
          cards[leoIndex].classList.add("flipped");
          gameOver = true;
        }
      }
    };
  });
}

/* ================================
   BUTTONS
================================ */
playButton.onclick = () => {
  document.body.classList.remove("home");
  document.body.classList.add("playing");
  initGame();
  playButton.textContent = "Play Again";
  playButton.classList.remove("start");
  playButton.classList.add("play-again-state");
};

difficultySelect.onchange = () => {
  playButton.textContent = "Start";
  playButton.classList.add("start");
  playButton.classList.remove("play-again-state");
};

volumeButton.onclick = () => {
  if (!bgAudio) {
    bgAudio = new Audio("Winter Festival.mp3");
    bgAudio.loop = true;
  }
  musicOn = !musicOn;
  musicOn ? bgAudio.play() : bgAudio.pause();
  volumeButton.textContent = musicOn ? "🔊" : "🔇";
};

/* ================================
   SNOW (p5.js)
================================ */
function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "9999");
  canvas.style("pointer-events", "none");
  noStroke();
}

function draw() {
  clear();
  fill(255, 200);
  if (random() < 0.05) snowflakes.push(new Snowflake());
  snowflakes.forEach(f => { f.update(); f.show(); });
  snowflakes = snowflakes.filter(f => f.y < height + 10);
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-20, 0);
    this.size = random(4, 8);
    this.speed = random(1, 3);
  }
  update() {
    this.y += this.speed;
    this.x += sin(frameCount / 50) * 0.5;
  }
  show() {
    ellipse(this.x, this.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
