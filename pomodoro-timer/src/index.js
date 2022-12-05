import './styles.css';

const startBtn = document.querySelector('.start');
const min = document.querySelector('.minutes__input');
const sec = document.querySelector('.seconds__input');
const circleWrapper = document.querySelector('.ring');

const sound = new Audio('../assets/bip.mp3');

const setting = document.querySelector('.settings');

const circle = document.querySelector('.progress-ring');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;

let secondsInit = 0;
let secondsCurr = 0;
let isChange = false;

let timeIntervalId = null;

const calcSec = (min, sec) => {
  return Number(min) * 60 + Number(sec);
};

const displayTime = (seconds) => {
  min.value = `${Math.floor(seconds / 60)}`.padStart(2, 0);
  sec.value = `${String(seconds % 60)}`.padStart(2, 0);
};

function setProgress() {
  const persent = (secondsCurr / secondsInit) * 100;

  if (persent <= 25) circleWrapper.classList.add('ending');
  else circleWrapper.classList.remove('ending');
  const offset = circumference - (persent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function addDisabled() {
  min.setAttribute('disabled', '');
  sec.setAttribute('disabled', '');
  circleWrapper.classList.remove('ending');
}

function stopTimer() {
  startBtn.textContent = 'start';
  clearInterval(timeIntervalId);
  timeIntervalId = null;
}

function addTimer() {
  timeIntervalId = setInterval(() => {
    if (secondsCurr === 1) {
      stopTimer();
      sound.play();
    }

    secondsCurr--;

    displayTime(secondsCurr);
    setProgress();
  }, 1000);
}

function startStopHandler() {
  if (startBtn.textContent == 'start') {
    if (secondsInit === 0 || isChange)
      secondsInit = calcSec(min.value, sec.value);

    if (secondsCurr === 0 || isChange) secondsCurr = secondsInit;

    if (!min.hasAttribute('disabled')) {
      addDisabled();
    }

    if (isNaN(secondsInit)) return;

    addTimer();
    isChange = false;
    startBtn.textContent = 'stop';
  } else {
    stopTimer();
  }
}

startBtn.addEventListener('click', startStopHandler);

setting.addEventListener('click', () => {
  stopTimer();
  isChange = true;
  if (min.hasAttribute('disabled')) {
    min.removeAttribute('disabled');
    sec.removeAttribute('disabled');
  } else {
    addDisabled();
  }
});
