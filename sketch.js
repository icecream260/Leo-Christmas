let cards;
let leoIndex;
let chances;
let gameOver = false;

const chancesDisplay = document.querySelector(".chances");
const playButton = document.querySelector(".play-again");
const volumeButton = document.querySelector(".volume-btn");

let bgAudio;
let musicOn = true;

// Game //
function initGame() {
  cards = document.querySelectorAll(".card");
  chances = 3;
  gameOver = false;

  chancesDisplay.innerHTML = `Chances: <span class="red-text">${chances}</span>`;

  cards.forEach(card => {
    card.classList.remove("flipped");
    const back = card.querySelector(".card-back");
    back.src = "photos/blank.png";
    back.classList.remove("leo-img");
  });

  leoIndex = Math.floor(Math.random() * cards.length);
  const leoImg = cards[leoIndex].querySelector(".card-back");
  leoImg.src = "photos/img15.png";
  leoImg.classList.add("leo-img");

  if (!bgAudio) {
    bgAudio = new Audio("Winter Festival.mp3");
    bgAudio.loop = true;
  }

  if (musicOn) {
    bgAudio.currentTime = 0;
    bgAudio.play();
  }
}

function setupClicks() {
  cards.forEach((card, index) => {
    card.onclick = () => {
      if (gameOver || card.classList.contains("flipped")) return;

      card.classList.add("flipped");

      if (index === leoIndex) {
        chancesDisplay.textContent = "🎄 You found the Christmas Leo Boy! 🎄";
        gameOver = true;
      } else {
        chances--;
        if (chances > 0) {
          chancesDisplay.innerHTML = `Chances Left: <span class="red-text">${chances}</span>`;
        } else {
          chancesDisplay.innerHTML = '<span class="red-text">Out of Chances!</span> The Christmas Tree Leo Boy has been revealed!🎄';
          cards[leoIndex].classList.add("flipped");
          gameOver = true;
        }
      }
    };
  });
}

// Play button // 
playButton.onclick = () => {
  initGame();
  setupClicks();
  playButton.textContent = "Play Again";
  playButton.classList.remove("start");
  playButton.classList.add("play-again-state");
};

// Volume //
volumeButton.onclick = () => {
  if (!bgAudio) return;
  musicOn = !musicOn;
  musicOn ? bgAudio.play() : bgAudio.pause();
  volumeButton.textContent = musicOn ? "🔊" : "🔇";
};

// Snow //
let snowflakes = [];

function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '9999');
  canvas.style('pointer-events', 'none');
  noStroke();
}

function draw() {
  clear();
  fill(255, 200);

  if (random() < 0.2) {
    snowflakes.push(new Snowflake());
  }

  for (let f of snowflakes) {
    f.update();
    f.show();
  }

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
