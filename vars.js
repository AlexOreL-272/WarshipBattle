let allyField;
let enemyField;

const allyFieldX = 90,
  allyFieldY = 260,
  enemyFieldX = 900,
  enemyFieldY = 260,
  cellSize = 50;

let dragged = false;
let touchedShip = [false, null];

let prevX, prevY;
let redShips = [];
let shipNumber = 0;

// let ship4;
// let ship3;
let arr;

const mode = {
  shipPositioning: 0,
  game: 1
};
let gameMode = mode.shipPositioning;

let turns = {
  ally: 0,
  enemy: 1
};

let turn = turns.ally;

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  // Top to bottom gradient
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}