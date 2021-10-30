var canvas = null;
var ctx = null;
var color = "rgba(255,0,0,0.5)";

var lastPress;
var dir = 68;
var speed = 4;
var score = 0;
var isPressed = false;
var data = 0;

var globalX = 20;
var globalY = 30;

var player = null;
var walls = new Array();
var stone = new Array();

var iPlayer = new Image();
var iWallsV = new Image();
var iWallsH = new Image();
var iStone = new Image();
var fondo = new Image();
var sPlanyer = new Audio();

var dirPlayer = new Array();
for (var x = 0; x <= 39; x++) {
  dirPlayer[x] = new Image();
}
var walk = dirPlayer[0];

//Se encarga de pintar todo en pantalla
function paint(ctx) {
  ctx.drawImage(fondo, 0, 0);

  for (var i = walls.length - 1; i >= 0; i--) {
    walls[i].fill(ctx);
    var wX = walls[i].x;
    var wY = walls[i].y;

    while (walls[i].h + walls[i].y >= wY + iWallsH.width) {
      ctx.drawImage(iWallsH, walls[i].x - 3, wY);
      wY += 25;
    }

    while (walls[i].w + walls[i].x >= wX + iWallsV.width) {
      if (
        (walls[i].x == 0 && walls[i].y == 0) ||
        (walls[i].x == 0 && walls[i].y == 495)
      ) {
        ctx.drawImage(iWallsH, wX, walls[i].y - 20);
      } else ctx.drawImage(iWallsV, wX, walls[i].y);
      wX += 25;
    }
  }
  ctx.drawImage(walk, player.x, player.y - 10);

  for (var i = stone.length - 1; i >= 0; i--) {
    ctx.drawImage(iStone, stone[i].x + 10, stone[i].y - 10);
  }

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("SCORE: " + score, 10, 20);
}

//Movimientos de la pintura
function update() {
  if (player.x > 700) console.log("salio 3");
  if (player.x < 0) console.log("salio 4");

  for (var i = walls.length - 1; i >= 0; i--) {
    if (player.touch(walls[i])) {
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
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  player = new Cuadrado(globalX, globalY, 20, 20, color);

  for (var x = 0; x <= 39; x++) {
    dirPlayer[x].src = "assets/player/" + (x + 1) + ".png";
  }

  iPlayer.src = "assets/player/1.png";
  fondo.src = "assets/background.png";

  iStone.src = "assets/piedra.png";
  iWallsH.src = "assets/baya2.png";
  iWallsV.src = "assets/arbusto1.png";
  sPlanyer.src = "assets/sounds_meow.wav";

  var tamImage = 20;
  //Bordes
  walls.push(new Cuadrado(684, 0, tamImage, 400));
  walls.push(new Cuadrado(0, 0, 700, tamImage));
  walls.push(new Cuadrado(3, 65, tamImage, 170));
  walls.push(new Cuadrado(3, 290, tamImage, 225));
  walls.push(new Cuadrado(0, 495, 700, tamImage));

  //barreras verticales
  var x = 30,
    w = 250;
  for (var y = 50; y <= 450; y += 50) {
    x = x + 50 > 90 ? 35 : x + 30;
    walls.push(new Cuadrado(x, y, w, tamImage));
    w -= 25;
  }

  walls.push(new Cuadrado(630, 250, 50, tamImage));
  walls.push(new Cuadrado(575, 250, 17, tamImage));
  walls.push(new Cuadrado(560, 300, 125, tamImage));
  walls.push(new Cuadrado(555, 350, 17, tamImage));
  walls.push(new Cuadrado(615, 350, 80, tamImage));
  walls.push(new Cuadrado(550, 400, 150, tamImage));
  (x = 500), (w = 180);
  for (var y = 50; y <= 450; y += 50) {
    x -= 20;
    w = w + 20 >= 200 ? w - 40 : w + 65;
    walls.push(new Cuadrado(x, y, w, tamImage, "grey"));
  }

  stone.push(new Cuadrado(260, 210, 33, 30));

  //barreras horizontales
  // walls.push(new Cuadrado(390, 50, tamImage, 50, "grey"));
  // walls.push(new Cuadrado(370, 150, tamImage, 75, "grey"));

  // walls.push(new Cuadrado(240, 255, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(175, 350, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(275, 355, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(225, 400, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(100, 455, tamImage, 50, "grey"));

  stone.push(new Cuadrado(480, 20, 50, 50));
  stone.push(new Cuadrado(600, 60, 50, 50));

  stone.push(new Cuadrado(470, 150, 50, 50, "grey"));
  stone.push(new Cuadrado(575, 200, 50, 50, "grey"));
  stone.push(new Cuadrado(380, 250, 50, 50, "grey"));
  stone.push(new Cuadrado(450, 300, 50, 50, "grey"));
  stone.push(new Cuadrado(350, 350, 50, 50, "grey"));
  stone.push(new Cuadrado(490, 400, 50, 50, "grey"));

  start();
}

//Clase Cuadro
function Cuadrado(x, y, w, h, color) {
  //atributos
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;

  //funciones
  this.fill = function (ctx) {
    ctx.fillStyle = this.color;
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
}

document.addEventListener(
  "keydown",
  function (evt) {
    lastPress = evt.keyCode;

    data = null;
    if (lastPress == 38) {
      dir = "arriba";
      player.y -= speed;
      data = 20;
    } else if (lastPress == 40) {
      dir = "abajo";
      player.y += speed;
      data = 0;
    } else if (lastPress == 39) {
      dir = "derecha";
      player.x += speed;
      data = 30;
    } else if (lastPress == 37) {
      dir = "izquierda";
      player.x -= speed;
      data = 10;
    } else console.log("presiona otra tecla");

    if (data != null) {
      walk =
        dirPlayer.indexOf(walk) >= data && dirPlayer.indexOf(walk) <= data + 8
          ? dirPlayer[dirPlayer.indexOf(walk) + 1]
          : dirPlayer[data];
    }
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
