const audioAA = new Audio('./assets/audios/audioAA.mp3');
const audioAB = new Audio('./assets/audios/audioAB.mp3');
const audioAC = new Audio('./assets/audios/audioAC.mp3');
const audioBA = new Audio('./assets/audios/audioBA.mp3');
const audioBB = new Audio('./assets/audios/audioBB.mp3');
const audioBC = new Audio('./assets/audios/audioBC.mp3');
const audioCA = new Audio('./assets/audios/audioCA.mp3');
const audioCB = new Audio('./assets/audios/audioCB.mp3');
const audioCC = new Audio('./assets/audios/audioCC.mp3');
const audioDA = new Audio('./assets/audios/audioDA.mp3');
const audioDB = new Audio('./assets/audios/audioDB.mp3');
const audioDC = new Audio('./assets/audios/audioDC.mp3');
const audioEA = new Audio('./assets/audios/audioEA.mp3');
const audioEB = new Audio('./assets/audios/audioEB.mp3');
const audioEC = new Audio('./assets/audios/audioEC.mp3');

const audioPack = {
  0: ['SUBWAY STATION', audioAA, audioAB, audioAC],
  1: ['BOOMY ROOM', audioBA, audioBB, audioBC],
  2: ['OUTDOORS SPEECH', audioCA, audioCB, audioCC],
  3: ['BASKETBALL COURT', audioDA, audioDB, audioDC],
  4: ['UKULELE SINGER', audioEA, audioEB, audioEC]
};

const audioCount = Object.keys(audioPack).length - 1;

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const currentSource = document.getElementById('current-source');
const btnA = document.getElementById('btn-a');
const btnB = document.getElementById('btn-b');
const btnC = document.getElementById('btn-c');
const trackA = document.getElementById('track-a');
const trackB = document.getElementById('track-b');
const trackC = document.getElementById('track-c');

let nowPlaying = 0;
let isPlaying = false;
let statusA = true;
let statusB = true;
let statusC = true;

// Update Current Source Title
currentSource.innerHTML = audioPack[nowPlaying][0];

// Play & Pause
btnPlay.addEventListener('click', play);
btnPause.addEventListener('click', pause);

function play() {
  audioPack[nowPlaying][1].play();
  audioPack[nowPlaying][2].play();
  audioPack[nowPlaying][3].play();
  isPlaying = true;
  progress();

  btnPlay.classList.add('hidden');
  btnPause.classList.remove('hidden');
};

function pause() {
  audioPack[nowPlaying][1].pause();
  audioPack[nowPlaying][2].pause();
  audioPack[nowPlaying][3].pause();
  isPlaying = false;

  btnPlay.classList.remove('hidden');
  btnPause.classList.add('hidden');
};

// Pause All
function pauseAll() {
  for (let i in audioPack) {
    audioPack[i][1].pause();
    audioPack[i][2].pause();
    audioPack[i][3].pause();
    audioPack[i][1].currentTime = 0;
    audioPack[i][2].currentTime = 0;
    audioPack[i][3].currentTime = 0;
  };
  isPlaying = false;
};

// Change Source
btnPrev.addEventListener('click', function() {
  let wasPlaying;
  if (isPlaying == true) {
    wasPlaying = true;
  };
  pauseAll();
  if (nowPlaying > 0) {
    nowPlaying--;
  } else {
    nowPlaying = audioCount;
  };
  currentSource.innerHTML = audioPack[nowPlaying][0];
  setVolume();
  if (wasPlaying == true) {
    play()
  };
});

btnNext.addEventListener('click', function() {
  let wasPlaying;
  if (isPlaying == true) {
    wasPlaying = true;
  };
  pauseAll();
  if (nowPlaying < audioCount) {
    nowPlaying++;
  } else {
    nowPlaying = 0;
  };
  currentSource.innerHTML = audioPack[nowPlaying][0];
  setVolume();
  if (wasPlaying == true) {
    play()
  };
});

// Toggle Each Track
btnA.addEventListener('click', toggleA);
btnB.addEventListener('click', toggleB);
btnC.addEventListener('click', toggleC);

function toggleA() {
  if (statusA == true) {
    trackA.classList.add('off');
    audioPack[nowPlaying][1].muted = true;
    statusA = false;
  } else {
    trackA.classList.remove('off');
    audioPack[nowPlaying][1].muted = false;
    statusA = true;
  };
};

function toggleB() {
  if (statusB == true) {
    trackB.classList.add('off');
    audioPack[nowPlaying][2].muted = true;
    statusB = false;
  } else {
    trackB.classList.remove('off');
    audioPack[nowPlaying][2].muted = false;
    statusB = true;
  };
};

function toggleC() {
  if (statusC == true) {
    trackC.classList.add('off');
    audioPack[nowPlaying][3].muted = true;
    statusC = false;
  } else {
    trackC.classList.remove('off');
    audioPack[nowPlaying][3].muted = false;
    statusC = true;
  };
};

// Adjust Mute Status
function setVolume() {
  if (statusA == true) {
    audioPack[nowPlaying][1].muted = false;
  } else {
    audioPack[nowPlaying][1].muted = true;
  };
  if (statusB == true) {
    audioPack[nowPlaying][2].muted = false;
  } else {
    audioPack[nowPlaying][2].muted = true;
  };
  if (statusC == true) {
    audioPack[nowPlaying][3].muted = false;
  } else {
    audioPack[nowPlaying][3].muted = true;
  };
};

// Progress Bar
function progress() {
  let progressInterval = setInterval(progressUpdate, 10);
  function progressUpdate() {
    let duration = audioPack[nowPlaying][1].duration;
    let currentTime = audioPack[nowPlaying][1].currentTime;
    let currentPercent = currentTime * 100 / duration;
    let progress = document.getElementById('progress-bar');
    progress.style.width = currentPercent + '%';
  };
};

// Check Playback Completion
let checkAudioEndInterval = setInterval(checkAudioEnd, 10);
function checkAudioEnd() {
  audioPack[nowPlaying][1].onended = function() {
    pauseAll();
    if (nowPlaying < audioCount) {
      nowPlaying++;
    } else {
      nowPlaying = 0;
    };
    currentSource.innerHTML = audioPack[nowPlaying][0];
    play();
    setVolume();
  };
};


