let minh, maxh, margin, lineangle, incomediv, data;
let wheels = [];

function preload() {
  data = loadTable("velos.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  minh = min(data.getColumn("hoehe"));
  maxh = max(data.getColumn("hoehe"));
  margin = width / 5;
  incomediv = 900;
  lineangle = atan(height / width);
  textSize(28);
  textFont('Timonium')
  for (row of data.rows) {
    let h = map(row.obj.hoehe, minh, maxh, 0 + margin, width - margin);
    let r = row.obj.eink / incomediv;
    let v = row.obj.velo;
    let e = row.obj.ebike;
    let posX = h;
    let posY = height - h * tan(lineangle);
    let centerVect = createVector(posX, posY);
    wheels.push(new Wheel(centerVect, v, e, r));
  }
}

function draw() {
  background(250);
  noStroke();
  fill(0);
  text("Velos", margin-60, margin/2);
  text("E-Bikes", width-margin-60, height-margin/2);
  stroke(0);
  strokeWeight(1);
  line(0, height, width, 0);
  fill(20);
  mousePos = createVector(mouseX, mouseY);
  for (w of wheels) {
    w.mouseDist = p5.Vector.dist(w.centerVect, mousePos);
  }
  closest = min(wheels.map((w) => w.mouseDist));
  for (w of wheels) {
    w.draw(lineangle, w.mouseDist == closest && closest < 300);
  }
}

class Wheel {
  /**
   * @param {vector} centerVect - The centerpoint as vector
   * @param {Number} velo - Number of velos
   * @param {Number} ebike - Number of ebikes
   * @param {Number} radius - Radius (size) of the Wheel
   **/
  constructor(centerVect, velo, ebike, radius) {
    this.centerVect = centerVect;
    this.velo = velo;
    this.ebike = ebike;
    this.radius = radius;
  }

  /**
   * @param {vector} offsetDeg - The initial rotation of the wheel
   * @param {boolean} highlight - Draw this wheel boldly, Default: false.
   **/
  draw(offsetDeg, highlight = false) {
    let alpha = 100;
    strokeWeight(1);
    if (highlight) {
      alpha = 255;
      strokeWeight(1.5);
    }
    fill(250);
    stroke(0, 0, 0, alpha);
    this.drawHalfWheel(
      this.centerVect,
      this.radius,
      this.velo,
      -degrees(offsetDeg)
    );
    fill(0, 0, 0, alpha);
    this.drawHalfWheel(
      this.centerVect,
      this.radius,
      this.ebike,
      -degrees(offsetDeg) + 180
    );
  }

  set mouseDist(dist) {
    this.dist = dist;
  }

  get mouseDist() {
    return this.dist;
  }

  /**
   * @param {vector} centerVect - The centerpoint as vector
   * @param {Number} radius - The wheel radius
   * @param {Number} count - Number of lines
   * @param {Number} offsetDeg - Initial rotation in degrees
   **/
  drawHalfWheel(centerVect, radius, count, offsetDeg) {
    let segmentangle = 180 / (+count + 1);
    let startangle = offsetDeg + segmentangle;
    for (let i = 0; i < count; i++) {
      let angle = radians(startangle + i * segmentangle);
      let dstY = radius * sin(angle);
      let dstX = radius * cos(angle);
      let dstVect = p5.Vector.sub(centerVect, createVector(dstX, dstY));
      line(centerVect.x, centerVect.y, dstVect.x, dstVect.y);
      circle(dstVect.x, dstVect.y, 5);
    }
  }
}