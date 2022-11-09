let minh, maxh, margin, incomediv, data;

function preload() {
  data = loadTable("velos.csv", "csv", "header");
}

function setup() {
  createCanvas(1280, 720);
  //noLoop();
  console.log(data);
  minh = min(data.getColumn("hoehe"));
  maxh = max(data.getColumn("hoehe"));
  margin = width / 7;
  incomediv=900;
}

/**
 * @param {vector} centerVect - The centerpoint as vector
 * @param {Number} radius - The wheel radius
 * @param {Number} count - Number of lines
 * @param {Number} offsetDeg - Initial rotation in degrees
 **/
function drawWheel(centerVect, radius, count, offsetDeg) {
  let segmentangle = 180 / (+count + 1);
  let startangle = offsetDeg + segmentangle;
  for (let i = 0; i < count; i++) {
    let angle = radians(startangle + i * segmentangle);
    let dstY = radius * sin(angle);
    let dstX = radius * cos(angle);
    let dstVect = p5.Vector.sub(centerVect, createVector(dstX, dstY));
    stroke(0,0,0,64);
    line(centerVect.x, centerVect.y, dstVect.x, dstVect.y);
    circle(dstVect.x, dstVect.y, 5);
    //circle(centerVect.x,centerVect.y,2*radius);
  }
}

function draw() {
  background(250);
  line(0,height,width,0);
  let lineangle = atan(height / width);
  for (row of data.rows) {
    let h = map(row.obj.hoehe, minh, maxh, 0 + margin, width - margin);
    let r = row.obj.eink / incomediv;
    let v = row.obj.velo;
    let e = row.obj.ebike;
    let posX = h;
    let posY = height - h * tan(lineangle);
    let centerVect = createVector(posX, posY);
    //noFill();
    fill(250);
    drawWheel(centerVect, r, v, -degrees(lineangle));
    fill(0);
    drawWheel(centerVect, r, e, -degrees(lineangle) + 180);
  }
}
