"use strict";

// 오디오 파일 불러오기 & 배열화
var audioAA = new Audio('../assets/audios/audioAA.mp3');
audioAA.loop = true;
var audioAB = new Audio('../assets/audios/audioAB.mp3');
audioAB.loop = true;
var audioAC = new Audio('../assets/audios/audioAC.mp3');
audioAC.loop = true;
var audioBA = new Audio('../assets/audios/audioBA.mp3');
audioBA.loop = true;
var audioBB = new Audio('../assets/audios/audioBB.mp3');
audioBB.loop = true;
var audioBC = new Audio('../assets/audios/audioBC.mp3');
audioBC.loop = true;
var audioPack = {
  0: ['Subway Station', audioAA, audioAB, audioAC],
  1: ['Boomy Room', audioBA, audioBB, audioBC]
};
var audioCount = Object.keys(audioPack).length - 1;
var nowPlaying = 0;
var isPlaying = false; // 방문자 기기 체크 (iPhone, iPad, iOS)
// 모바일인 경우, iPad인 경우
// 창 너비에 변화가 일어날 때
// 재생 상황 리셋
// 플레이어 네비게이션 타이틀 리셋

var btnPrev = document.getElementById('btn-prev');
var btnNext = document.getElementById('btn-next');
btnPrev.addEventListener('click', function () {
  pauseAll();

  if (nowPlaying > 0) {
    nowPlaying--;
  } else {
    nowPlaying = audioCount;
  }

  ; // playerNav.html(audioPack[nowPlaying][0]);
  // setVolume();
});
btnNext.addEventListener('click', function () {
  pauseAll();

  if (nowPlaying < audioCount) {
    nowPlaying++;
  } else {
    nowPlaying = 0;
  }

  ;
}); // 플레이어

var btnPlay = document.getElementById('btn-play');
var btnPause = document.getElementById('btn-pause');
btnPlay.addEventListener('click', play);
btnPause.addEventListener('click', pause);

function play() {
  audioPack[nowPlaying][1].play();
  audioPack[nowPlaying][2].play();
  audioPack[nowPlaying][3].play();
}

;

function pause() {
  audioPack[nowPlaying][1].pause();
  audioPack[nowPlaying][2].pause();
  audioPack[nowPlaying][3].pause();
}

;

function pauseAll() {
  for (var i in audioPack) {
    audioPack[i][1].pause();
    audioPack[i][2].pause();
    audioPack[i][3].pause();
    audioPack[i][1].currentTime = 0;
    audioPack[i][2].currentTime = 0;
    audioPack[i][3].currentTime = 0;
  }

  ;
  isPlaying = false;
}

;

function controlA(a) {
  document.getElementById('value-a').innerHTML = a;
  audioAA.volume = a;
}

;