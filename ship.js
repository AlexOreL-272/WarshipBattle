/*  %----------> x
    |
    |
    |
    V
    y
*/

const direction = {
  down: [0, 1],
  right: [1, 0]
}

class Ship {
  constructor(size, xPos, yPos, dir) {
    this.size = size;
    this.xPos = xPos;
    this.yPos = yPos;
    this.number = shipNumber++;
    this.hit = new Array(size).fill(false);
    this.colorMode = false;
    this.color = [
      [200, 70, 100],
      [0, 70, 100]
    ];
    this.direction = dir;
  }
}