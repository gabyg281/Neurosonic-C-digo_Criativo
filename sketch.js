
/*NEUROSONIC
  Variáveis principais*/

let audioContext;
let analyser;
let microphone;
let audioData;
let smoothedAudioData;

let soundAmount = 0;
let smoothSound = 0;

let waves = [];

// Configurações visuais
const NUMBER_OF_LINES = 6;
const NUMBER_OF_POINTS = 120;
const MAX_WAVES = 9;


/*SETUP E DRAW*/

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  audioData = new Uint8Array(1024);
  smoothedAudioData = new Float32Array(1024);

  background(3, 5, 17);

  createMicButton();
}

function draw() {
  background(3, 5, 17);

  updateAudio();
  updateWaves();

  drawFluidLines();
  drawSoundIndicator();
}


/*MICROFONE*/

function createMicButton() {
  let button = createButton("Ativar microfone");

  button.position(20, 20);
  button.mousePressed(startMicrophone);

  button.style("background", "#111b35");
  button.style("color", "#ffffff");
  button.style("border", "1px solid #35d9e8");
  button.style("padding", "10px 15px");
  button.style("border-radius", "8px");
  button.style("cursor", "pointer");
}

async function startMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    audioContext = new AudioContext();

    microphone = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    microphone.connect(analyser);

    audioData = new Uint8Array(analyser.fftSize);
    smoothedAudioData = new Float32Array(analyser.fftSize);

  } catch (error) {
    console.log("Não foi possível ativar o microfone:", error);
  }
}

function updateAudio() {
  if (!analyser) {
    smoothSound = lerp(smoothSound, 0, 0.08);
    return;
  }

  analyser.getByteTimeDomainData(audioData);

  let sum = 0;

  for (let i = 0; i < audioData.length; i++) {
    let value = (audioData[i] - 128) / 128;

    sum += value * value;

    // Suaviza a leitura do áudio
    smoothedAudioData[i] = lerp(
      smoothedAudioData[i],
      value,
      0.3
    );
  }

  soundAmount = sqrt(sum / audioData.length);

  let amplifiedSound = constrain(soundAmount * 5.5, 0, 1);

  smoothSound = lerp(smoothSound, amplifiedSound, 0.15);
}


/*ONDAS CRIADAS PELO RATO*/

function updateWaves() {
  for (let i = waves.length - 1; i >= 0; i--) {
    waves[i].age++;

    if (waves[i].age > 160) {
      waves.splice(i, 1);
    }
  }
}

function createWave(x, y, strength = 1) {
  if (waves.length >= MAX_WAVES) {
    waves.shift();
  }

  waves.push({
    x: x,
    y: y,
    age: 0,
    speed: random(2, 3.5),
    strength: strength,
    size: random(35, 65)
  });
}


/*DESENHO DAS LINHAS*/

function drawFluidLines() {
  let allLines = [];

  for (let layer = 0; layer < NUMBER_OF_LINES; layer++) {
    let points = [];

    let baseY = map(
      layer,
      0,
      NUMBER_OF_LINES - 1,
      height * 0.38,
      height * 0.62
    );

    let layerScale = map(
      layer,
      0,
      NUMBER_OF_LINES - 1,
      0.7,
      1.3
    );

    for (let i = 0; i <= NUMBER_OF_POINTS; i++) {
      let x = map(i, 0, NUMBER_OF_POINTS, 0, width);

      let y = baseY;

      // Movimento subtil das linhas
      y += sin(x * 0.004 + frameCount * 0.008 + layer) * 4;
      y += sin(x * 0.009 - frameCount * 0.006 + layer * 0.5) * 2;

      // Deformação provocada pelo áudio
      if (analyser) {
        let sampleIndex = floor(
          map(i, 0, NUMBER_OF_POINTS, 0, smoothedAudioData.length - 1)
        );

        // Junta amostras próximas para evitar picos bruscos
        let audioValue = 0;
        let samples = 0;

        for (let j = -2; j <= 2; j++) {
          let index = constrain(
            sampleIndex + j,
            0,
            smoothedAudioData.length - 1
          );

          audioValue += smoothedAudioData[index];
          samples++;
        }

        audioValue /= samples;

        // Intensidade da deformação sonora
        y += audioValue * 400 * layerScale;
      }

      // Deformação provocada pelo rato
      for (let wave of waves) {
        let dx = x - wave.x;
        let dy = baseY - wave.y;

        let distance = sqrt(dx * dx + dy * dy);
        let radius = wave.age * wave.speed;

        let difference = abs(distance - radius);

        if (difference < wave.size) {
          let influence = map(difference, 0, wave.size, 1, 0);
          let fade = map(wave.age, 0, 160, 1, 0);

          y += sin(difference * 0.12) *
            influence *
            fade *
            wave.strength *
            35 *
            layerScale;
        }
      }

      points.push({ x, y });
    }

    allLines.push(points);
  }

  // Efeito de brilho
  for (let i = 0; i < allLines.length; i++) {
    if (i % 2 === 0) {
      drawStoredLine(allLines[i], 5, 35);
    }
  }

  // Linhas principais
  for (let i = 0; i < allLines.length; i++) {
    drawStoredLine(allLines[i], 1.5, 180, i);
  }
}


/*CORES E APARÊNCIA DAS LINHAS*/

function drawStoredLine(points, weight, alpha, layer = 0) {
  let colors = [
    [20, 220, 230],
    [30, 170, 255],
    [90, 100, 255],
    [180, 70, 240],
    [230, 80, 190]
  ];

  let c = colors[layer % colors.length];

  noFill();

  stroke(c[0], c[1], c[2], alpha);
  strokeWeight(weight);

  beginShape();

  for (let point of points) {
    splineVertex(point.x, point.y);
  }

  endShape();
}

/*INDICADOR DE SOM*/

function drawSoundIndicator() {
  noStroke();
  fill(30, 210, 230, 150);

  let barWidth = map(smoothSound, 0, 1, 0, 150, true);

  rect(20, 65, barWidth, 4, 3);
}

/*INTERAÇÃO DO RATO*/

function mousePressed() {
  if (mouseY < 90 && mouseX < 200) {
    return;
  }

  createWave(mouseX, mouseY, 1);
}

function mouseDragged() {
  if (frameCount % 10 === 0) {
    createWave(mouseX, mouseY, 0.7);
  }
}

/*REDIMENSIONAR JANELA*/

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}