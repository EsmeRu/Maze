var canvas = null;
var ctx = null;
var lastPress;
var dir = 68,
  speed = 2,
  data = 0;
var globalX = 20,
  globalY = 30;
var player = null;
var walls = new Array(),
  stone = new Array();
var iPlayer = new Image(),
  iWallsV = new Image(),
  iWallsH = new Image(),
  iStone = new Image(),
  fondo = new Image();
var newTime = false,
  acumularTime = 0;
var time = new Array(),
  sounds = new Array(),
  dirPlayer = new Array();
for (var x = 0; x <= 6; x++) sounds[x] = new Audio();
for (var x = 0; x <= 39; x++) dirPlayer[x] = new Image();
var walk = null;
var tamImage = 20;
var move = false;

//Se encarga de pintar todo en pantalla
function paint(ctx) {
  ctx.drawImage(fondo, 0, 0);
  for (var i = walls.length - 1; i >= 0; i--) {
    var wX = walls[i].x;
    var wY = walls[i].y;

    while (walls[i].h + walls[i].y >= wY + iWallsH.width) {
      ctx.drawImage(iWallsH, walls[i].x - 5, wY);
      wY += 25;
    }
    while (walls[i].w + walls[i].x >= wX + iWallsV.width) {
      if (
        (walls[i].x == 0 && walls[i].y == 0) ||
        (walls[i].x == 0 && walls[i].y == 505)
      )
        ctx.drawImage(iWallsH, wX, walls[i].y - 20);
      else ctx.drawImage(iWallsV, wX + 5, walls[i].y);
      wX += 25;
    }
  }
  ctx.drawImage(walk, player.x, player.y - 10);

  for (var i = stone.length - 1; i >= 0; i--)
    ctx.drawImage(iStone, stone[i].x + 5, stone[i].y - 8);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Courier New";
  ctx.fillText("TIEMPO: " + time[2] + ":" + time[1] + ":" + time[0], 500, 20);
}
//Movimientos de la pintura
function update() {
  sounds[2].oncanplaythrough = (event) => {
    sounds[2].loop = true;
    var playedPromise = sounds[2].play();
    if (playedPromise) {
      playedPromise.catch((e) => {
        if (e.name === "NotAllowedError" || e.name === "NotSupportedError") {
          console.log(e.name);
        }
      });
    }
  };

  if (move) {
    if (lastPress == 38) {
      dir = "arriba";
      player.y -= speed;
      data = 20;
    }
    if (lastPress == 40) {
      dir = "abajo";
      player.y += speed;
      data = 0;
    }
    if (lastPress == 39) {
      dir = "derecha";
      player.x += speed;
      data = 30;
    }
    if (lastPress == 37) {
      dir = "izquierda";
      player.x -= speed;
      data = 10;
    }
    walk =
      dirPlayer.indexOf(walk) >= data && dirPlayer.indexOf(walk) <= data + 8
        ? dirPlayer[dirPlayer.indexOf(walk) + 1]
        : dirPlayer[data];
  }

  for (var i = walls.length - 1; i >= 0; i--) {
    if (player.touch(walls[i]) || player.x < -2 || player.x > 700) {
      if (dir == "arriba") player.y += speed;
      if (dir == "abajo") player.y -= speed;
      if (dir == "derecha") player.x -= speed;
      if (dir == "izquierda") player.x += speed;
    }
  }
  for (var i = stone.length - 1; i >= 0; i--) {
    if (player.touch(stone[i])) {
      if (dir == "arriba") player.y += speed;
      if (dir == "abajo") player.y -= speed;
      if (dir == "derecha") player.x -= speed;
      if (dir == "izquierda") player.x += speed;
    }
  }
}
//Manda pintar y actualizar los frames
function start() {
  window.requestAnimationFrame(start);
  update();
  paint(ctx);
}
//inicializa las variables necesarias
function run() {
  startTime();
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  walk = dirPlayer[0];

  player = new Cuadrado(globalX, globalY, 20, 20);

  for (var x = 0; x <= 39; x++) {
    dirPlayer[x].src = "assets/player/" + (x + 1) + ".png";
  }
  for (var x = 0; x <= 6; x++) {
    sounds[x].src = "assets/sound/" + (x + 1) + ".mp3";
  }

  iPlayer.src = "assets/player/1.png";
  fondo.src = "assets/background.png";

  iStone.src = "assets/piedra.png";
  iWallsH.src = "assets/baya2.png";
  iWallsV.src = "assets/arbusto1.png";

  border();
  verticalWall();
  horizontalWall();
  start();
}
const border = () => {
  walls.push(new Cuadrado(684, 0, tamImage, 400));
  walls.push(new Cuadrado(0, 0, 700, tamImage));
  walls.push(new Cuadrado(3, 65, tamImage, 170));
  walls.push(new Cuadrado(3, 290, tamImage, 225));
  walls.push(new Cuadrado(0, 505, 700, tamImage));
};
const verticalWall = () => {
  var x = 30,
    w = 250; //Primera columna vertical
  for (var y = 50; y <= 450; y += 50) {
    x = x + 30 > 65 ? 35 : x + 30;
    walls.push(new Cuadrado(x, y, w, tamImage));
    w -= 25;
  }
  (w = 250), (x = 150); //Segunda columna vertical
  for (var y = 450; y >= 50; y -= 50) {
    walls.push(new Cuadrado(x, y, w, tamImage, "grey"));
    x = y == 100 || y == 200 || y == 300 || y == 400 ? (x += 55) : (x -= 5);
    w -= 25;
  }
  (x = 430), (w = 0); //Tercera columna vertical
  for (var y = 50; y <= 450; y += 50) {
    w = w + 20 >= 200 ? w - 50 : w + 50;
    walls.push(new Cuadrado(x, y, w, tamImage, "grey"));
    x = x - 20 < 410 ? 430 : x - 30;
  }
  (x = 510), (w = 125); //Cuarta columna vertical
  for (var y = 50; y <= 400; y += 50) {
    walls.push(new Cuadrado(x, y, w, tamImage, "grey"));
    x = y == 50 ? 525 : 620;
  }
};
const horizontalWall = () => {
  const stonesXY = [
    [390, 20],
    [600, 45],
    [555, 70],
    [430, 70],
    [40, 70],
    [127, 80],
    [203, 50],
    [535, 120],
    [330, 120],
    [260, 145],
    [25, 195],
    [430, 170],
    [330, 170],
    [620, 195],
    [485, 220],
    [170, 220],
    [270, 220],
    [545, 237],
    [640, 267],
    [190, 267],
    [400, 267],
    [25, 300],
    [540, 320],
    [300, 320],
    [620, 345],
    [200, 370],
    [95, 320],
    [25, 395],
    [455, 365],
    [400, 420],
    [110, 450],
    [547, 450],
    [590, 475],
    [615, 475],
    [640, 475],
    [665, 475],
  ];
  for (var x = 0; x <= stonesXY.length - 1; x++) {
    stone.push(new Cuadrado(stonesXY[x][0], stonesXY[x][1], tamImage, 40));
  }
};
function Cuadrado(x, y, w, h) {
  //atributos
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  //funciones
  this.fill = function (ctx) {
    ctx.fillRect(this.x, this.y, this.w, this.h);
  };

  this.touch = function (cuadro) {
    if (
      this.x < cuadro.x + cuadro.w &&
      this.x + this.w > cuadro.x &&
      this.y < cuadro.y + cuadro.h &&
      this.y + this.h > cuadro.y
    ) {
      return true;
    }
    return false;
  };
} //Clase Cuadro
function winner(salida) {
  var gif = "";
  sounds[6].play();
  if (salida == 1) {
    gif = "url('./assets/win2.gif')";
  } else {
    gif = "url('./assets/win.gif')";
  }
  stop();
  Swal.fire({
    title: `<h1 style="color: #fff; font-size: 2.5rem;">¡Felicidades! \n Has llegado a la salida ${salida}</h1>`,
    html: `<p style="color: #fff;">Terminaste el juego en ${time[2]}:${time[1]}:${time[0]}</p>`,
    background: "transparent",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#2E6D1D",
    backdrop: `
      rgba(0,0,123,0.4)
      ${gif}
      center top
      no-repeat
    `,
  }).then((value) => {
    if (value) {
      run();
    }
  });
} //Alerta de ganador
function warning() {
  sounds[5].play();
  Swal.fire({
    title: "<h1 style='color: #000;'>Por ahí no es</h1>",
    background: "transparent",
    backdrop: `
      rgba(0,0,123,0.4)
      url("./assets/hey-listen.gif")
      center center
      no-repeat
    `,
    showConfirmButton: false,
    timer: 1300,
  });
} //Alerta de camino equivocado
function startTime() {
  if (newTime == false) {
    timeInicial = new Date();
    control = setInterval(timer, 10);
    newTime = true;
  }
} //Inicio del contador
function timer() {
  timeActual = new Date();
  acumularTime = timeActual - timeInicial;
  acumularTime2 = new Date();
  acumularTime2.setTime(acumularTime);
  time[0] = acumularTime2.getSeconds();
  time[1] = acumularTime2.getMinutes();
  time[2] = acumularTime2.getHours() - 18;
  if (time[0] < 10) time[0] = "0" + time[0];
  if (time[1] < 10) time[1] = "0" + time[1];
  if (time[2] < 10) time[2] = "0" + time[2];
} //Contador de tiempo
function stop() {
  if (newTime == true) {
    clearInterval(control);
    newTime = false;
  }
} //Stop del tiempo
function reset() {
  if (newTime == true) {
    clearInterval(control);
    newTime = false;
  }
  acumularTime = 0;
  time[0] = time[1] = time[2] = "00";
} //reset del tiempo
document.addEventListener(
  "keydown",
  function (evt) {
    lastPress = evt.keyCode;

    move =
      lastPress == 38 || lastPress == 39 || lastPress == 40 || lastPress == 37
        ? true
        : false;

    if (lastPress == 32)
      sounds[2].muted = sounds[2].muted == true ? false : true;

    if (player.x < 0 && player.y < 70) {
      warning();
    }
    if (player.x > 700 && player.y > 400) {
      winner(1);
    }
    if (player.x < 0 && player.y > 100) {
      winner(2);
    }
  },
  false
);

document.addEventListener(
  "keyup",
  function (evt) {
    lastPress = evt.keyCode;
    move = false;
  },
  false
);

window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 17);
    }
  );
})();
window.addEventListener("load", run, false);
