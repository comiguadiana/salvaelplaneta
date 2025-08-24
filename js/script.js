// Configuración inicial del juego (tu código existente)
let canvas, ctx, score = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const livesElement = document.getElementById('lives');
  const scoreElement = document.getElementById('score');
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');
  const rankingButton = document.getElementById('ranking-button');
  const rankingPopup = document.getElementById('ranking-popup');
  const closePopup = document.getElementById('close-popup');
  const submitscore = document.getElementById('submit-score');

  // Abrir popup
  rankingButton.addEventListener('click', function () {
    rankingPopup.style.display = 'block';
    loadRanking();
  });

  // Cerrar popup
  closePopup.addEventListener('click', function () {
    rankingPopup.style.display = 'none';
  });

  // Cerrar popup al hacer clic fuera
  window.addEventListener('click', function (event) {
    if (event.target === rankingPopup) {
      rankingPopup.style.display = 'none';
    }
  });


  submitscore.addEventListener('click', function () {
    const nombre = document.getElementById('player-name');
    const puntuacion = document.getElementById('puntuacion');
    const score = puntuacion.textContent;
    console.log("nombre:" + nombre.value.trim());
    let playerName = nombre.value.trim();
    if (playerName) {
      saveScore(playerName, score);
      winModal.style.display = 'none';
      resetGame();
    }
  });


  restartBtn.addEventListener('click', function () {
    winModal.style.display = 'none';
    resetGame();
  });

  // Guardar puntuación en Firebase
  function saveScore(name, score) {
    console.log(name, score);
    database.ref('scores').push({
      name: name,
      score: score,
      date: new Date().toISOString()
    });
  }

  // Cargar ranking desde Firebase
  function loadRanking() {
    database.ref('scores').orderByChild('score').limitToLast(10).once('value')
      .then(snapshot => {
        let rankings = [];
        snapshot.forEach(child => {
          rankings.push(child.val());
        });
        rankings.reverse(); // Ordenar de mayor a menor
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        rankings.forEach(player => {
          let item = document.createElement('li');
          item.textContent = `${player.name}: ${player.score} puntos`;
          rankingList.appendChild(item);
        });
      });
  }


  // Configuración del juego
  const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    lives: 3,
    score: 0,
    player: {
      width: 80,
      height: 80,
      x: window.innerWidth / 2 - 40,
      y: window.innerHeight - 200,
      speed: 5,
    },
    balls: [],
    ballSpeed: 1,
    ballSize: 50,
    ballImages: ['planeta1.png', 'planeta2.png', 'planeta3.png', 'planeta4.png', 'planeta5.png', 'planeta6.png', 'planeta7.png', 'planeta8.png'],
    playerImages: ['alien1.png', 'alien2.png', 'alien3.png', 'alien4.png', 'alien5.png', 'alien6.png', 'alien7.png', 'alien8.png', 'alien9.png', 'alien10.png', 'alien11.png', 'alien12.png', 'alien13.png', 'alien14.png', 'alien15.png'],
    currentPlayerImage: null,
    gameRunning: true,
    keys: { left: false, right: false }, // Estado de las teclas
  };

  // Cargar imágenes de pelotas
  const ballImages = {};
  config.ballImages.forEach(src => {
    ballImages[src] = new Image();
    ballImages[src].src = `img/${src}`;
  });

  // Cargar imágenes de personajes
  const playerImages = {};
  config.playerImages.forEach(src => {
    playerImages[src] = new Image();
    playerImages[src].src = `img/${src}`;
  });

  // Imagen de fondo
  const backgroundImage = new Image();
  backgroundImage.src = 'img/fondo.jpg';

  // Inicializar el canvas
  function initCanvas() {
    canvas.width = config.width;
    canvas.height = config.height;
  }

  // Seleccionar personaje aleatorio
  function selectRandomPlayer() {
    const randomPlayer = config.playerImages[Math.floor(Math.random() * config.playerImages.length)];
    config.currentPlayerImage = playerImages[randomPlayer];
  }

  // Dibujar el fondo
  function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  // Dibujar el jugador
  function drawPlayer() {
    ctx.drawImage(
      config.currentPlayerImage,
      config.player.x,
      config.player.y,
      config.player.width,
      config.player.height
    );
  }

  // Crear una pelota aleatoria
  function createBall() {
    const randomBall = config.ballImages[Math.floor(Math.random() * config.ballImages.length)];
    config.balls.push({
      x: Math.random() * (canvas.width - config.ballSize),
      y: -config.ballSize,
      speed: config.ballSpeed + Math.random() * 2,
      image: ballImages[randomBall],
    });
  }

  // Dibujar y actualizar las pelotas
  function drawBalls() {
    config.balls.forEach((ball, index) => {
      ctx.drawImage(ball.image, ball.x, ball.y, config.ballSize, config.ballSize);
      ball.y += ball.speed;

      // Colisión con el jugador
      if (
        ball.y + config.ballSize > config.player.y &&
        ball.x + config.ballSize > config.player.x &&
        ball.x < config.player.x + config.player.width
      ) {
        config.balls.splice(index, 1);
        config.score++;
        scoreElement.textContent = config.score;
      }

      // Pelota fuera de la pantalla
      if (ball.y > canvas.height - 100) {
        config.balls.splice(index, 1);
        config.lives--;
        livesElement.textContent = config.lives;
        if (config.lives <= 0) {
          config.gameRunning = false;


          const puntuacion = document.getElementById('puntuacion');

          puntuacion.textContent = config.score;
          winModal.style.display = 'flex';
        }
      }
    });
  }

  // Mover al jugador según el estado de las teclas o botones
  function movePlayer() {
    if (!config.gameRunning) return;
    if (config.keys.left && config.player.x > 0) {
      config.player.x -= config.player.speed;
    }
    if (config.keys.right && config.player.x < canvas.width - config.player.width) {
      config.player.x += config.player.speed;
    }
  }

  // Reiniciar el juego
  function resetGame() {
    config.lives = 3;
    config.score = 0;
    config.balls = [];
    livesElement.textContent = config.lives;
    scoreElement.textContent = config.score;
    config.gameRunning = true;
    selectRandomPlayer();
    setTimeout(() => {
      window.location.reload();

    }, 500);

  }

  // Bucle principal del juego
  function gameLoop() {
    if (!config.gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawBalls();
    movePlayer(); // Mueve al jugador en cada frame

    // Crear pelotas aleatoriamente
    if (Math.random() < 0.02) {
      createBall();
    }

    requestAnimationFrame(gameLoop);
  }

  // Event listeners para los botones táctiles
  leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    config.keys.left = true;
  });
  leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    config.keys.left = false;
  });
  rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    config.keys.right = true;
  });
  rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    config.keys.right = false;
  });

  // Event listeners para el teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') config.keys.left = true;
    if (e.key === 'ArrowRight') config.keys.right = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') config.keys.left = false;
    if (e.key === 'ArrowRight') config.keys.right = false;
  });

  // Inicializar el juego
  window.addEventListener('load', () => {
    initCanvas();
    selectRandomPlayer();
    gameLoop();
  });

  // Ajustar el canvas al redimensionar la ventana
  window.addEventListener('resize', () => {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    config.player.x = window.innerWidth / 2 - config.player.width / 2;
    initCanvas();
  });
});
