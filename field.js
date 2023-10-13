const state = {
  empty: 0,
  ship: 1,
  missedShot: 2,
  goalShot: 3,
};

class Field {
  constructor(xPos, yPos, step, isEnemy) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.step = step;
    this.killedShips = 9;
    this.enemy = isEnemy;
    this.field = [];
    for (let i = 0; i < 10; i++) {
      let arr = [];
      for (let j = 0; j < 10; j++)
        arr.push([state.empty, null]);
      this.field.push(arr);
    }
  }

  // clears the field
  clear() {
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++)
        this.field[i][j] = [state.empty, null];

    this.killedShips = 0;
    turn = turns.ally;
    shipNumber = 0;
    redShips = [];

    arr = new Array(10);
    arr[0] = new Ship(4, 1, 0, [1, 0]);
    arr[1] = new Ship(3, 6, 2, [0, 1]);
    arr[2] = new Ship(3, 2, 5, [0, 1]);
    arr[3] = new Ship(2, 0, 2, [0, 1]);
    arr[4] = new Ship(2, 4, 7, [0, 1]);
    arr[5] = new Ship(2, 7, 6, [1, 0]);
    arr[6] = new Ship(1, 8, 1, [1, 0]);
    arr[7] = new Ship(1, 3, 2, [1, 0]);
    arr[8] = new Ship(1, 1, 9, [1, 0]);
    arr[9] = new Ship(1, 7, 9, [1, 0]);

    for (let item of arr) {
      this.addShip(item);
    }
  }

  addShip(newShip) {
    for (let i = newShip.xPos, j = newShip.yPos; i < newShip.xPos + newShip.size && j < newShip.yPos + newShip.size; i += newShip.direction[0], j += newShip.direction[1]) {
      this.field[i][j] = [state.ship, newShip];
    }
  }

  removeShip(ship) {
    for (let i = ship.xPos, j = ship.yPos; i < ship.xPos + ship.size && j < ship.yPos + ship.size; i += ship.direction[0], j += ship.direction[1]) {
      this.field[i][j] = [state.empty, null];
    }
  }

  rotateShip(ship) {
    this.removeShip(ship);
    ship.direction = ship.direction == direction.right ? direction.down : direction.right;
    this.addShip(ship);
  }

  applyShot(x, y) {
    let position = this.field[x][y][1];

    if (this.field[x][y][0] == state.empty) {
      this.field[x][y] = [state.missedShot, null];
      turn = turn == turns.ally ? turns.enemy : turns.ally;
    }
    if (this.field[x][y][0] == state.ship) {
      this.field[x][y][0] = state.goalShot;
      this.field[x][y][1].hit[Math.abs(x - position.xPos) + Math.abs(y - position.yPos)] = true;

      const thisShip = this.field[x][y][1];
      if (thisShip.hit.filter(el => el).length == thisShip.size) {
        this.killedShips++;

        for (let i = thisShip.xPos - 1; i <= thisShip.xPos + thisShip.size * thisShip.direction[0] + thisShip.direction[1]; i++) {
          for (let j = thisShip.yPos - 1; j <= thisShip.yPos + thisShip.size * thisShip.direction[1] + thisShip.direction[0]; j++) {
            if (i < 0 || i >= 10 || j < 0 || j >= 10 || this.field[i][j][0] == state.goalShot)
              continue;

            this.field[i][j][0] = state.missedShot;
          }
        }
      }
    }
  }

  showShips() {

  }

  render() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        fill(90);
        stroke(0);
        square(this.xPos + i * this.step, this.yPos + j * this.step, this.step);
        switch (this.field[i][j][0]) {
          case state.empty:
            break;
          case state.ship:
            if (!this.enemy) {
              noStroke();
              const ship = this.field[i][j][1];
              fill(...ship.color[+ship.colorMode]);
              square(
                this.xPos + i * this.step,
                this.yPos + j * this.step,
                this.step
              );
            }
            break;
          case state.missedShot:
            fill(75);
            circle(
              this.xPos + (i + 0.5) * this.step,
              this.yPos + (j + 0.5) * this.step,
              this.step / 2
            );
            break;
          case state.goalShot:
            if (!this.enemy) {
              noStroke();
              fill(200, 70, 100);
              square(
                this.xPos + i * this.step,
                this.yPos + j * this.step,
                this.step
              );
            }
            fill(0, 80, 80);
            circle(
              this.xPos + (i + 0.5) * this.step,
              this.yPos + (j + 0.5) * this.step,
              this.step / 2
            );
            break;
        }
      }
    }
  }
}