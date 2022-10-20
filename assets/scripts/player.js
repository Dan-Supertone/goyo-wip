// 오디오 파일 불러오기 & 배열화
const audioAA = new Audio('../assets/audios/audioAA.mp3');
const audioAB = new Audio('../assets/audios/audioAB.mp3');
const audioAC = new Audio('../assets/audios/audioAC.mp3');
const audioBA = new Audio('../assets/audios/audioBA.mp3');
const audioBB = new Audio('../assets/audios/audioBB.mp3');
const audioBC = new Audio('../assets/audios/audioBC.mp3');
const audioCA = new Audio('../assets/audios/audioCA.mp3');
const audioCB = new Audio('../assets/audios/audioCB.mp3');
const audioCC = new Audio('../assets/audios/audioCC.mp3');
const audioDA = new Audio('../assets/audios/audioDA.mp3');
const audioDB = new Audio('../assets/audios/audioDB.mp3');
const audioDC = new Audio('../assets/audios/audioDC.mp3');

const audioPack = {
  0: ['Subway Station', audioAA, audioAB, audioAC],
  1: ['Boomy Room', audioBA, audioBB, audioBC],
  2: ['Outdoors Speech', audioCA, audioCB, audioCC],
  3: ['Noisy Radio', audioDA, audioDB, audioDC]
};

const audioCount = Object.keys(audioPack).length - 1;

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const navPlay = document.getElementById('nav-play');
const btnA = document.getElementById('btn-a');
const btnB = document.getElementById('btn-b');
const btnC = document.getElementById('btn-c');

let nowPlaying = 0;
let isPlaying = false;
let statusA = true;
let statusB = true;
let statusC = true;





// 노브 조작 마우스 세로 드래그만 되게!!!!!



// 방문자 기기 체크 (iPhone, iPad, iOS)
  // 모바일인 경우, iPad인 경우
  // 창 너비에 변화가 일어날 때
  // 재생 상황 리셋

// 플레이어 네비게이션 타이틀 리셋
navPlay.innerHTML = audioPack[nowPlaying][0];











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
  navPlay.innerHTML = audioPack[nowPlaying][0];
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
  navPlay.innerHTML = audioPack[nowPlaying][0];
  setVolume();
  if (wasPlaying == true) {
    play()
  };
});





btnPlay.addEventListener('click', play);
btnPause.addEventListener('click', pause);




function play() {
  audioPack[nowPlaying][1].play();
  audioPack[nowPlaying][2].play();
  audioPack[nowPlaying][3].play();
  isPlaying = true;
  progress();
};

function pause() {
  audioPack[nowPlaying][1].pause();
  audioPack[nowPlaying][2].pause();
  audioPack[nowPlaying][3].pause();
  isPlaying = false;
};

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








btnA.addEventListener('click', toggleA);
btnB.addEventListener('click', toggleB);
btnC.addEventListener('click', toggleC);

function toggleA() {
  if (statusA == true) {
    btnA.classList.add('off');
    audioPack[nowPlaying][1].muted = true;
    statusA = false;
  } else {
    btnA.classList.remove('off');
    audioPack[nowPlaying][1].muted = false;
    statusA = true;
  };
};

function toggleB() {
  if (statusB == true) {
    btnB.classList.add('off');
    audioPack[nowPlaying][2].muted = true;
    statusB = false;
  } else {
    btnB.classList.remove('off');
    audioPack[nowPlaying][2].muted = false;
    statusB = true;
  };
};

function toggleC() {
  if (statusC == true) {
    btnC.classList.add('off');
    audioPack[nowPlaying][3].muted = true;
    statusC = false;
  } else {
    btnC.classList.remove('off');
    audioPack[nowPlaying][3].muted = false;
    statusC = true;
  };
};

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







function progress() {
  audioPack[nowPlaying][1].addEventListener("timeupdate", function () {
    let duration = audioPack[nowPlaying][1].duration;
    let currentTime = audioPack[nowPlaying][1].currentTime;
    let currentPercent = currentTime * 100 / duration;
    let progress = document.getElementById('progress-bar');
    progress.style.width = currentPercent + '%';
  });
};

audioPack[nowPlaying][1].onended = function() {
  pauseAll();
  if (nowPlaying < audioCount) {
    nowPlaying++;
  } else {
    nowPlaying = 0;
  };
  navPlay.innerHTML = audioPack[nowPlaying][0];
  play();
  setVolume();
};



