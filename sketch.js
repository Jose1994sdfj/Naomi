let stars = [];
let hearts = [];
let bigStars = [];
let waves = [];
let messages = [
  "Naomi... cada vez que pienso en ti, mi cuerpo reacciona como si estuvieras aquí.",
  "Tus labios me persiguen en sueños, y despierto con ganas de volver a besarte.",
  "No quiero una noche más sin el calor de tu piel junto a la mía.",
  "Eres más que deseo, eres mi necesidad más dulce.",
  "Quiero perderme entre tus suspiros... sin prisa, sin final.",
  "Tu voz me enciende más que cualquier canción... susúrrame aunque sea en silencio.",
  "Entre tus brazos no hay tiempo, solo piel, aliento y latidos.",
  "Naomi… me haces sentir completo, como si mi alma reconociera la tuya.",
  "Quiero que sepas que no solo deseo tu cuerpo, también deseo tus días, tus risas y tus silencios.",
  "Estar contigo no es solo placer… es paz, es fuego, es hogar.",
  "Tus caricias me encienden, pero tus palabras me tocan más profundo.",
  "Te amo con la piel, con el alma… y con la paciencia de quien sabe esperar tus tiempos.",
  "Naomi, cada vez que tocas mi vida, la haces mejor. No solo me gustas… me importas.",
  "Contigo quiero besos lentos, pero también conversaciones eternas.",
  "Eres deseo, sí… pero también eres ternura, refugio y la mujer con la que quiero todo."
];
let msgIndex = 0;
let showMessage = false;
let lastTouch = 0;
let touchCount = 0;
let backgroundColor;
let targetColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Georgia, serif");
  backgroundColor = color(10, 10, 30);
  targetColor = color(10, 10, 30);
  for (let i = 0; i < 120; i++) {
    stars.push(new Star());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  backgroundColor = lerpColor(backgroundColor, targetColor, 0.01);
  background(backgroundColor);

  for (let s of stars) {
    s.move();
    s.show();
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].move();
    hearts[i].show();
    if (hearts[i].isFaded()) {
      hearts.splice(i, 1);
    }
  }

  for (let i = bigStars.length - 1; i >= 0; i--) {
    bigStars[i].move();
    bigStars[i].show();
    if (bigStars[i].isFaded()) {
      bigStars.splice(i, 1);
    }
  }

  // Ondas expansivas en círculo de energía
  if (frameCount % 60 === 0) {
    waves.push(new Wave(width / 2, height / 2));
  }
  for (let i = waves.length - 1; i >= 0; i--) {
    waves[i].move();
    waves[i].show();
    if (waves[i].isDead()) {
      waves.splice(i, 1);
    }
  }

  let baseTextSize = min(width, height) / 10;

  // Glow alrededor del texto "Naomi"
  let glowAlpha = map(sin(frameCount * 0.1), -1, 1, 100, 200);
  fill(255, 100, 200, glowAlpha);
  textSize(baseTextSize * 1.2);
  textAlign(CENTER, CENTER);
  text("Naomi", width / 2, height / 2 - baseTextSize * 0.3);

  // Texto principal vibrando
  fill(255, 100, 200);
  textSize(baseTextSize + sin(frameCount * 0.05) * baseTextSize * 0.08);
  text("Naomi", width / 2, height / 2 - baseTextSize * 0.3);

  // Estrella grande rotando y brillante cerca del nombre
  if (frameCount % 120 < 60) {
    fill(255, 150, 200, map(sin(frameCount * 0.1), -1, 1, 50, 200));
    noStroke();
    if (bigStars.length === 0) {
      bigStars.push(new BigStar(width / 2 + baseTextSize * 2, height / 2 - baseTextSize * 0.3));
    }
  }

  // Mostrar mensaje si toca
  if (showMessage) {
    fill(255);
    textSize(baseTextSize * 0.6);
    textFont("Georgia, serif");
    textAlign(LEFT, TOP);
    let textWidthLimit = width * 0.8;
    textWrap(WORD);
    text(messages[msgIndex], width / 2 - textWidthLimit / 2, height / 2 + baseTextSize, textWidthLimit, baseTextSize * 3);
  }

  // Mensaje final si toca mucho
  if (touchCount >= 15) {
    fill(255, 200, 200);
    textSize(baseTextSize / 3);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(
      "Naomi, solo tú puedes mantener este universo vivo.\nQuédate conmigo para siempre.",
      width / 2,
      height - baseTextSize * 1.5
    );

    // Mensaje "Con amor, Jesús"
    textSize(baseTextSize / 4);
    textStyle(NORMAL);
    fill(255, 180, 220);
    text("Con amor, Jesús", width / 2, height - baseTextSize);
  }

  if (millis() - lastTouch > 6000) {
    showMessage = false;
  }

  for (let s of stars) {
    s.returnToBase();
  }
}

function touchStarted() {
  lastTouch = millis();
  showMessage = true;
  msgIndex = (msgIndex + 1) % messages.length;
  touchCount++;

  if (touchCount >= 5) {
    targetColor = color(60, 10, 30);
  }
  if (touchCount >= 10) {
    targetColor = color(100, 20, 40);
  }
  if (touchCount >= 15) {
    targetColor = color(150, 30, 60);
  }

  for (let i = 0; i < 15; i++) {
    stars.push(new Star(mouseX, mouseY, true));
  }

  for (let i = 0; i < 3; i++) {
    hearts.push(new Heart(mouseX + random(-15, 15), mouseY + random(-15, 15)));
  }

  bigStars.push(new BigStar(mouseX, mouseY));

  // Limitar tamaño máximo array stars para que no crezca infinito
  if (stars.length > 300) {
    stars.splice(0, stars.length - 300);
  }

  // Reiniciar todo después de 15 clics
  if (touchCount > 15) {
    touchCount = 0;
    msgIndex = 0;
    showMessage = false;
    targetColor = color(10, 10, 30);

    stars = [];
    hearts = [];
    bigStars = [];
    waves = [];

    for (let i = 0; i < 120; i++) {
      stars.push(new Star());
    }
  }

  return false;
}

function starShape(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

class Star {
  constructor(x, y, burst = false) {
    this.baseX = burst ? x : random(width);
    this.baseY = burst ? y : random(height);
    this.x = this.baseX;
    this.y = this.baseY;
    this.brightness = random(150, 255);
    this.size = random(1.5, 3);
    this.speed = burst ? random(1, 3) : random(0.1, 0.5);
    this.burst = burst;
    this.dirX = burst ? random(-3, 3) : 0;
    this.dirY = burst ? random(-3, 3) : 0;
    this.returning = false;
    this.pulsePhase = random(TWO_PI);
  }

  move() {
    this.brightness = 200 + 55 * sin(frameCount * 0.05 + this.pulsePhase);
    this.size = 1.5 + 1.5 * sin(frameCount * 0.05 + this.pulsePhase);

    if (this.burst && !this.returning) {
      this.x += this.dirX;
      this.y += this.dirY;

      if (random(1) < 0.02) {
        this.returning = true;
      }
    }
    if (this.returning) {
      this.x = lerp(this.x, this.baseX, 0.05);
      this.y = lerp(this.y, this.baseY, 0.05);

      if (dist(this.x, this.y, this.baseX, this.baseY) < 0.5) {
        this.returning = false;
        this.burst = false;
      }
    }
  }

  returnToBase() {
    if (this.returning) {
      this.x = lerp(this.x, this.baseX, 0.05);
      this.y = lerp(this.y, this.baseY, 0.05);
    }
  }

  show() {
    noStroke();
    fill(255, this.brightness);
    circle(this.x, this.y, this.size);
  }
}

class Heart {
  constructor(x, y) {
    this.baseX = x;
    this.x = x;
    this.y = y;
    this.size = random(15, 25);
    this.alpha = 255;
    this.speedY = random(-0.5, -1.2);
    this.oscillationPhase = random(TWO_PI);
  }

  move() {
    this.y += this.speedY;
    this.alpha -= 3;
    this.x = this.baseX + 10 * sin(frameCount * 0.05 + this.oscillationPhase);
  }

  isFaded() {
    return this.alpha <= 0;
  }

  show() {
    noStroke();
    fill(255, 100, 180, this.alpha);
    heartShape(this.x, this.y, this.size);
  }
}

function heartShape(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

class BigStar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 35);
    this.alpha = 255;
    this.alphaChange = -3;
    this.angle = 0;
    this.angleSpeed = 0.01;
  }

  move() {
    this.alpha += this.alphaChange;
    if (this.alpha <= 100 || this.alpha >= 255) {
      this.alphaChange *= -1;
    }
    this.angle += this.angleSpeed;
  }

  isFaded() {
    return this.alpha <= 0;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, 150, 220, this.alpha);
    noStroke();
    starShape(0, 0, this.size / 3, this.size, 5);
    pop();
  }
}

class Wave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 150;
  }
  move() {
    this.radius += 2;
    this.alpha -= 1.5;
  }
  isDead() {
    return this.alpha <= 0;
  }
  show() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
  }
}
