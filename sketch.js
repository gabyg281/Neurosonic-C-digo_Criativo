let mic;
let level = 0;
let t = 0;
let spacing;
let xStep;
let noiseScale = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Melhora o desempenho em ecrãs de alta resolução
  pixelDensity(1);

  // Limita a velocidade para reduzir o processamento
  frameRate(25);

  // Ajusta a quantidade de linhas e pontos ao tamanho do ecrã
  updateResolution();

  mic = new p5.AudioIn();
  mic.start();
  noFill();
}

function draw() {
  background(0);

  // Leitura do som
  let vol = mic.getLevel();

  // Reação sonora sensível e suavizada
  level = lerp(
  level,
  constrain(vol * 35, 0, 1),
  0.1
  );

  // Movimento contínuo das linhas
  t += 0.01;

  // Linhas que atravessam todo o ecrã
  for (let y = -200; y <= height + 200; y += spacing) {
  stroke(255);
  strokeWeight(1 + level * 0.5);
  beginShape();

  for (let x = -100; x <= width + 100; x += xStep) {

  // Ruído orgânico
  let n = noise(
  x * noiseScale,
  y * noiseScale,
  t
  );

  // O som amplifica a deformação
  let amp = 60 + level * 300;
  let dy = (n - 0.5) * amp;

  curveVertex(x, y + dy);
  }
  endShape();
  }
}
// Ajusta a quantidade de pontos ao tamanho do ecrã
function updateResolution() {
  spacing = max(6, height / 100);
  xStep = max(10, width / 80);
}
// Adapta o canvas quando a janela muda de tamanho
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateResolution();
}