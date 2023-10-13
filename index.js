function setup() {
  createCanvas(1500, 848);
  colorMode(HSB);
  frameRate(60);
  textSize(36);

  allyField = new Field(allyFieldX, allyFieldY, cellSize, false);
  enemyField = new Field(enemyFieldX, enemyFieldY, cellSize, true);

  allyField.clear();
  enemyField.clear();
}

function draw() {
  background(200, 204, 191);
  setGradient(0, 0, 1500, 848, color(200, 204, 191), color(185, 60, 80));

  if (redShips.length && millis() - redShips[0][1] > 500) {
    redShips[0][0].colorMode = false;
    redShips.shift();
  }

  allyField.render();
  enemyField.render();

  if (gameMode == mode.shipPositioning) {
    setGradient(670, 460, 150, 100, color(185, 20, 100), color(185, 20, 75));
    text("Done!", 697, 520);
  }

  if (allyField.killedShips == 10) {
    textSize(54);
    text("You lose! :(", 610, 360);

    textSize(36);
    setGradient(670, 460, 150, 100, color(185, 20, 100), color(185, 20, 75));
    text("Restart", 685, 522);
  } else if (enemyField.killedShips == 10) {
    textSize(54);
    text("You won!", 635, 360);

    textSize(36);
    setGradient(670, 460, 150, 100, color(185, 20, 100), color(185, 20, 75));
    text("Restart", 685, 522);
  }
}

function mouseClicked() {
  //console.log(mouseX, mouseY);

  const x = mouseX,
    y = mouseY;
  const inBounds = (x, y) => {
    return allyFieldX <= x && x <= allyFieldX + cellSize * 10 &&
      allyFieldY <= y && y <= allyFieldY + cellSize * 10;
  }
  const positionAccepted = (x, y, size, dir) => 0 <= x && x + (size - 1) * dir[1] < 10 && 0 <= y && y + (size - 1) * dir[0] < 10;
  const doesNotTouchOtherShips = (ship) => {
    let flag = true;

    for (let i = ship.xPos - 1; i <= ship.xPos + ship.size * ship.direction[1] + ship.direction[0]; i++) {
      for (let j = ship.yPos - 1; j <= ship.yPos + ship.size * ship.direction[0] + ship.direction[1]; j++) {
        if (i < 0 || i >= 10 || j < 0 || j >= 10)
          continue;

        const cell = allyField.field[i][j];
        if (cell[0] == state.ship && cell[1].number != ship.number) {
          flag = false;
        }
      }
    }

    return flag;
  }

  switch (gameMode) {
    case mode.shipPositioning:

      if (inBounds(x, y)) {
        const xPos = Math.floor((x - allyFieldX) / cellSize),
          yPos = Math.floor((y - allyFieldY) / cellSize);

        if (dragged) {
          dragged = false;
          touchedShip = [false, null];
          return;
        }

        if (allyField.field[xPos][yPos][0] == state.ship) {
          const [size, dir] = [allyField.field[xPos][yPos][1].size, allyField.field[xPos][yPos][1].direction];
          const flag = doesNotTouchOtherShips(allyField.field[xPos][yPos][1]),
            rightPos = positionAccepted(xPos, yPos, size, dir);

          if (flag && rightPos) {
            allyField.rotateShip(allyField.field[xPos][yPos][1]);
          } else {
            // if (!flag || !rightPos) {
            allyField.field[xPos][yPos][1].colorMode = true;
            if (!redShips.length || redShips[redShips.length - 1].number != allyField.field[xPos][yPos][1].number)
              redShips.push([allyField.field[xPos][yPos][1], millis()]);
          }
        }
      } else if (670 <= x && x <= 820 && 460 <= y && y <= 560) {
        gameMode = mode.game;
      }

      break;

    case mode.game:

      if (inBounds(x, y) && turn == turns.enemy) {
        const xPos = Math.floor((x - allyFieldX) / cellSize),
          yPos = Math.floor((y - allyFieldY) / cellSize);

        allyField.applyShot(xPos, yPos);
      }

      if (enemyFieldX <= x && x <= enemyFieldX + cellSize * 10 && enemyFieldY <= y && y <= enemyFieldY + cellSize * 10 && turn == turns.ally) {
        const xPos = Math.floor((x - enemyFieldX) / cellSize),
          yPos = Math.floor((y - enemyFieldY) / cellSize);

        enemyField.applyShot(xPos, yPos);
      }

      if (670 <= x && x <= 820 && 460 <= y && y <= 560) {
        gameMode = mode.shipPositioning;

        allyField.clear();
        enemyField.clear();
      }

      break;
  }
}

function mouseDragged() {
  if (gameMode == mode.game)
    return;

  dragged = true;

  const inBounds = (x, y) => {
    return allyFieldX <= x && x <= allyFieldX + cellSize * 10 &&
      allyFieldY <= y && y <= allyFieldY + cellSize * 10;
  }
  const positionAccepted = (x, y, size, dir) => {
    return allyFieldX <= x && x < allyFieldX + cellSize * (10 - (size - 1) * dir[0]) &&
      allyFieldY <= y && y < allyFieldY + cellSize * (10 - (size - 1) * dir[1]);
  }
  const doesNotTouchOtherShips = (ship) => {
    let flag = true;

    for (let i = ship.xPos - 1; i <= ship.xPos + ship.size * ship.direction[0] + ship.direction[1]; i++) {
      for (let j = ship.yPos - 1; j <= ship.yPos + ship.size * ship.direction[1] + ship.direction[0]; j++) {
        // (ship.xPos <= i && i <= ship.xPos + (ship.size - 1) * ship.direction[0] &&
        //   ship.yPos <= j && j <= ship.yPos + (ship.size - 1) * ship.direction[1])
        if (i < 0 || i >= 10 || j < 0 || j >= 10)
          continue;

        if (allyField.field[i][j][0] == state.ship) {
          flag = false;
        }
      }
    }

    return flag;
  }

  if (inBounds(mouseX, mouseY)) {
    const xPos = Math.floor((mouseX - allyFieldX) / cellSize),
      yPos = Math.floor((mouseY - allyFieldY) / cellSize);

    if (allyField.field[xPos][yPos][0] == state.ship || touchedShip[0]) {
      if (!touchedShip[0])
        touchedShip = [true, allyField.field[xPos][yPos][1]];

      prevX = touchedShip[1].xPos;
      prevY = touchedShip[1].yPos;
      allyField.removeShip(touchedShip[1]);

      const [size, dir] = [touchedShip[1].size, touchedShip[1].direction];
      if (positionAccepted(mouseX, mouseY, size, dir)) {
        touchedShip[1].xPos = Math.floor((mouseX - allyFieldX) / cellSize);
        touchedShip[1].yPos = Math.floor((mouseY - allyFieldY) / cellSize);
      } else if (
        mouseX > allyFieldX + cellSize * (10 - (size - 1) * dir[0]) &&
        allyFieldY <= mouseY && mouseY <= allyFieldY + cellSize * 10
      ) {
        touchedShip[1].yPos = Math.floor((mouseY - allyFieldY) / cellSize);
      } else if (
        allyFieldX <= mouseX && mouseX <= allyFieldX + cellSize * 10 &&
        mouseY > allyFieldY + cellSize * (10 - (size - 1) * dir[1])
      ) {
        touchedShip[1].xPos = Math.floor((mouseX - allyFieldX) / cellSize);
      }

      const flag = !doesNotTouchOtherShips(touchedShip[1]);
      if (flag) {
        touchedShip[1].xPos = prevX;
        touchedShip[1].yPos = prevY;

        touchedShip[1].colorMode = true;
        if (!redShips.length || redShips[redShips.length - 1].number != touchedShip[1].number)
          redShips.push([touchedShip[1], millis()]);
      }

      allyField.addShip(touchedShip[1]);
    }
  }
}