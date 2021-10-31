var canvas = null;
var ctx = null;
var color = "rgba(255,0,0,0.5)";

var lastPress;
var dir = 68,
  speed = 4,
  score = 0,
  data = 0;
var isPressed = false;
var pantalla = document.getElementById("screen");

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

var sounds = new Array();
for (var x = 0; x <= 6; x++) sounds[x] = new Audio();

var dirPlayer = new Array();
for (var x = 0; x <= 39; x++) dirPlayer[x] = new Image();

var walk = dirPlayer[0];

//Se encarga de pintar todo en pantalla
function paint(ctx) {
  ctx.drawImage(fondo, 0, 0);

  for (var i = walls.length - 1; i >= 0; i--) {
    // walls[i].fill(ctx);
    var wX = walls[i].x;
    var wY = walls[i].y;

    while (walls[i].h + walls[i].y >= wY + iWallsH.width) {
      ctx.drawImage(iWallsH, walls[i].x - 3, wY);
      wY += 25;
    }

    while (walls[i].w + walls[i].x >= wX + iWallsV.width) {
      if (
        (walls[i].x == 0 && walls[i].y == 0) ||
        (walls[i].x == 0 && walls[i].y == 505)
      ) {
        ctx.drawImage(iWallsH, wX, walls[i].y - 20);
      } else ctx.drawImage(iWallsV, wX + 5, walls[i].y);
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
  sounds[0].play();
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

  for (var x = 0; x <= 6; x++) {
    sounds[x].src = "assets/sound/" + (x + 1) + ".mp3";
  }

  iPlayer.src = "assets/player/1.png";
  fondo.src = "assets/background.png";

  iStone.src = "assets/piedra.png";
  iWallsH.src = "assets/baya2.png";
  iWallsV.src = "assets/arbusto1.png";

  var tamImage = 20;
  //Bordes
  walls.push(new Cuadrado(684, 0, tamImage, 400));
  walls.push(new Cuadrado(0, 0, 700, tamImage));
  walls.push(new Cuadrado(3, 65, tamImage, 170));
  walls.push(new Cuadrado(3, 290, tamImage, 225));
  walls.push(new Cuadrado(0, 505, 700, tamImage));

  //barreras verticales
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

  // stone.push(new Cuadrado(260, 210, 33, 30));

  //barreras horizontales
  // walls.push(new Cuadrado(390, 50, tamImage, 50, "grey"));
  // walls.push(new Cuadrado(370, 150, tamImage, 75, "grey"));

  // walls.push(new Cuadrado(240, 255, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(175, 350, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(275, 355, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(225, 400, tamImage, 100, "grey"));
  // walls.push(new Cuadrado(100, 455, tamImage, 50, "grey"));

  // stone.push(new Cuadrado(480, 20, 50, 50));
  // stone.push(new Cuadrado(600, 60, 50, 50));

  // stone.push(new Cuadrado(470, 150, 50, 50, "grey"));
  // stone.push(new Cuadrado(575, 200, 50, 50, "grey"));
  // stone.push(new Cuadrado(380, 250, 50, 50, "grey"));
  // stone.push(new Cuadrado(450, 300, 50, 50, "grey"));
  // stone.push(new Cuadrado(350, 350, 50, 50, "grey"));
  // stone.push(new Cuadrado(490, 400, 50, 50, "grey"));

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
    if (player.x < 0 && player.y < 100) {
      warning();
    }
    if (player.x > 700) {
      winner(1);
    }
    if (player.x < 0 && player.y > 100) {
      winner(2);
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

function winner(salida) {
  var gif = "";
  sounds[6].play();
  if (salida == 1) {
    gif = "url('/assets/win2.gif')";
  } else {
    gif = "url('/assets/win.gif')";
  }
  Swal.fire({
    customClass: {
      title: "swal-title",
      confirmButton: "confirmBtn",
    },
    title: "¡Felicidades! \n Has llegado a la salida " + salida,
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
    location.reload();
  });
}
function warning() {
  sounds[5].play();
  Swal.fire({
    customClass: {
      confirmButton: "confirm",
    },
    title: "<h1 style='color: #000;'>¡Epa! \n Por ahí no es</h1>",
    background: "transparent",
    backdrop: `
      rgba(0,0,123,0.4)
      url("/assets/hey-listen.gif")
      center center
      no-repeat
    `,
  });
}

// var newTime = false;
//   var acumularTime = 0;
//   function start() {
//     if (newTime == false) {
//       timeInicial = new Date();
//       control = setInterval(cronometro, 10);
//       newTime = true;
//     }
//   }
//   function cronometro() {
//     timeActual = new Date();
//     acumularTime = timeActual - timeInicial;
//     acumularTime2 = new Date();
//     acumularTime2.setTime(acumularTime);
//     ss = acumularTime2.getSeconds();
//     mm = acumularTime2.getMinutes();
//     hh = acumularTime2.getHours() - 18;
//     if (ss < 10) ss = "0" + ss;
//     if (mm < 10) mm = "0" + mm;
//     if (hh < 10) hh = "0" + hh;
//     pantalla.innerHTML = hh + " : " + mm + " : " + ss;
//   }
//   function reset() {
//     if (newTime == true) {
//       clearInterval(control);
//       newTime = false;
//     }
//     acumularTime = 0;
//     pantalla.innerHTML = "00 : 00 : 00";
//   }

window.addEventListener("load", run, false);
