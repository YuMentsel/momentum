const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const body = document.querySelector('body');
const langIcon = document.querySelector('.lang-icon');
const enterName = document.querySelector('.name');

// Язык

let language = 'en';
function changeLang() {
  if (language == 'en') {
    language = 'ru';
    langIcon.classList.toggle('ru');
  } else {
    language = 'en';
    langIcon.classList.toggle('ru');
  }
  getWeather();
  getQuotes();
  // changeCityLang();
}
langIcon.addEventListener('click', changeLang);

const hours = new Date().getHours();

const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

function showDate() {
  const dataLang = {
    ru: 'ru-Ru',
    en: 'en-En',
  };
  const currentDate = new Date().toLocaleDateString(
    dataLang[language],
    options
  );
  date.textContent = currentDate[0].toUpperCase() + currentDate.slice(1);
}

// Приветствие
let timeOfDay;
const morning = 'morning';
const afternoon = 'afternoon';
const evening = 'evening';
const night = 'night';

function getTimeOfDay() {
  if (hours >= '06' && hours < '12') {
    timeIndex = 1;
    timeOfDay = morning;
  } else if (hours >= '12' && hours < '18') {
    timeIndex = 2;
    timeOfDay = afternoon;
  } else if (hours >= '18' && hours < '24') {
    timeIndex = 3;
    timeOfDay = evening;
  } else if (hours >= '00' && hours < '06') {
    timeIndex = 0;
    timeOfDay = night;
  }
}

function showGreeting() {
  getTimeOfDay();
  const greetingTranslation = {
    ru: [
      ['Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'],
      ['[Bведите ваше имя]'],
    ],
    en: [
      ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
      ['[Enter your name]'],
    ],
  };

  greeting.textContent = `${greetingTranslation[language][0][timeIndex]}, `;
  enterName.placeholder = `${greetingTranslation[language][1]}`;
}

// Сохранение имени

function setLocalStorage() {
  const name = document.querySelector('.name');
  localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const name = document.querySelector('.name');
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
}
window.addEventListener('load', getLocalStorage);

function showTime() {
  const currentTime = new Date().toLocaleTimeString();
  time.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}

showTime();

// Погода

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');

async function getWeather() {
  if (city.value === '') {
    city.value = 'Minsk';
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=7347d35ae08907e2f859501f2a505cd8&units=metric`;
  const res = await fetch(url);

  weatherIcon.className = 'weather-icon owf';
  weatherError.textContent = '';

  const textLang = {
    ru: [['Скорость ветра', 'Влажность']],
    en: [['Wind speed', 'Humidity']],
  };

  try {
    const data = await res.json();
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${textLang[language][0][0]}: ${Math.round(
      data.wind.speed
    )} m/s`;
    humidity.textContent = `${textLang[language][0][1]}: ${Math.round(
      data.main.humidity
    )}%`;
    city.value = data.name;
  } catch (err) {
    if (res.status === 404) {
      error();
    }
  }
}

function error() {
  const errText = {
    ru: 'Ошибка! нет резутьтата для',
    en: 'Error! city not found for',
  };
  weatherError.textContent = `${errText[language]} '${city.value}'!`;
  weatherIcon.className = 'weather-icon owf';
  temperature.textContent = '';
  weatherDescription.textContent = '';
  wind.textContent = '';
  humidity.textContent = '';
}

getWeather();

function setLocalStorageCity() {
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorageCity);

function getLocalStorageCity() {
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
  getWeather();
}
window.addEventListener('load', getLocalStorageCity);

function setCity(e) {
  if (e.code === 'Enter') {
    if (city.value === '') {
      error();
    } else {
      getWeather();
      city.blur();
    }
  }
}
city.addEventListener('keypress', setCity);

// Цитаты

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
let randomQuote;

function getRandomQuoteNum() {
  min = Math.ceil(0);
  max = Math.floor(32); //изменить число
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomQuote() {
  return (randomQuote = getRandomQuoteNum());
}

async function getQuotes() {
  const quotes = 'quotes.json';
  const res = await fetch(quotes);
  const data = await res.json();

  quote.textContent = `${data[randomQuote ?? 0].quote[language]}`;
  author.textContent = `${data[randomQuote ?? 0].author[language]}`;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);
changeQuote.addEventListener('click', getRandomQuote);

// Аудиоплеер

// const playList = [
//   {
//     title: 'Breaking Bad',
//     src: '../assets/sounds/Breaking Bad.mp3',
//     duration: '01:15'
//   },
//   {
//     title: 'Aqua Caelestis',
//     src: '../assets/sounds/Aqua Caelestis.mp3',
//     duration: '00:39'
//   },
//   {
//     title: 'River Flows In You',
//     src: '../assets/sounds/River Flows In You.mp3',
//     duration: '01:37'
//   },
//   {
//     title: 'Summer Wind',
//     src: '../assets/sounds/Summer Wind.mp3',
//     duration: '01:50'
//   }
// ]

// const play = document.querySelector('.play');
// const playPrevBtn = document.querySelector('.play-prev');
// const playNextBtn = document.querySelector('.play-next');
// const playListContainer = document.querySelector('.play-list');
// const audio = new Audio();
// let isPlay = false;
// let playNum = 0;

// function playAudio() {
//   audio.src = playList[playNum].src;;
//   audio.currentTime = 0;
//   if(!isPlay) {
//     audio.play();
//     isPlay = true;
//     play.classList.toggle('pause');
//   } else {
//     audio.pause();
//     isPlay = false;
//     play.classList.toggle('pause');
//   }
// }

// function playNext() {
//   (playNum == 3) ? playNum = 0 : playNum += 1;
//   audio.src = playList[playNum].src;;
//   audio.currentTime = 0;
//   audio.play();
//   setActiveSong();
// }

// function playPrev() {
//   (playNum == 0) ? playNum = 3 : playNum -= 1;
//   audio.src = playList[playNum].src;;
//   audio.currentTime = 0;
//   audio.play();
//   setActiveSong();
// }

// playList.forEach((el, i) => {
//   const li = document.createElement('li');
//   li.classList.add('play-item');
//   li.textContent = playList[i].title;
//   playListContainer.append(li);
// })

// const songs = document.querySelectorAll(".play-item");
// songs.forEach((e, i) => e.setAttribute("id", i));
// let currentSong;
// function setActiveSong() {
//     currentSong = document.getElementById(`${playNum}`);
//     songs.forEach((el) => el.classList.remove('item-active'));
//     currentSong.classList.add("item-active");
// }
// setActiveSong();

// play.addEventListener('click', playAudio);
// playNextBtn.addEventListener('click', playNext);
// playPrevBtn.addEventListener('click', playPrev);

// Аудиоплеер продвинутый

let trackName = document.querySelector('.track-name');
let playpauseBtn = document.querySelector('.playpause-track');
let nextBtn = document.querySelector('.next-track');
let prevBtn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');
const playListContainer = document.querySelector('.play-list');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;
let currentSong;

const playList = [
  {
    img: 'images/stay.png',
    name: 'Breaking Bad',
    music: './assets/sounds/Breaking Bad.mp3',
    totalDuration: '01:15',
  },
  {
    img: 'images/fallingdown.jpg',
    name: 'River Flows In You',
    music: './assets/sounds/River Flows In You.mp3',
    totalDuration: '01:37',
  },
  {
    img: 'images/faded.png',
    name: 'Aqua Caelestis',
    music: './assets/sounds/Aqua Caelestis.mp3',
    totalDuration: '00:39',
  },
  {
    img: 'images/ratherbe.jpg',
    name: 'Summer Wind',
    music: './assets/sounds/Summer Wind.mp3',
    totalDuration: '01:50',
  },
];

loadTrack(track_index);

function loadTrack(track_index) {
  clearInterval(updateTimer);
  reset();

  curr_track.src = playList[track_index].music;
  curr_track.load();
  trackName.textContent = playList[track_index].name;
  updateTimer = setInterval(setUpdate, 1000);

  curr_track.addEventListener('ended', nextTrack);
}

function reset() {
  curr_time.textContent = '00:00';
  total_duration.textContent = '00:00';
  seek_slider.value = 0;
}
function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}
function playRandom() {
  isRandom = true;
  randomIcon.classList.add('randomActive');
}
function pauseRandom() {
  isRandom = false;
  randomIcon.classList.remove('randomActive');
}
function repeatTrack() {
  let current_index = track_index;
  loadTrack(current_index);
  curr_track.play();
  isPlaying = true;
  setActiveSong();
}
function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpauseBtn.classList.toggle('pause');
  setActiveSong();
}
function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpauseBtn.classList.toggle('pause');
}
function nextTrack() {
  if (track_index < playList.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < playList.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * playList.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }
  loadTrack(track_index);
  curr_track.play();
  isPlaying = true;
  setActiveSong();
}
function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = playList.length - 1;
  }
  loadTrack(track_index);
  curr_track.play();
  isPlaying = true;
  setActiveSong();
}
function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}
function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

const sound = document.querySelector('.sound');
let isMute = false;

function toggleSound() {
  if (!isMute) {
    curr_track.volume = 0;
    isMute = true;
    sound.classList.toggle('off');
    volume_slider.classList.toggle('none');
  } else {
    curr_track.volume = volume_slider.value / 100;
    isMute = false;
    sound.classList.toggle('off');
    volume_slider.classList.toggle('none');
  }
}

function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = '0' + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = '0' + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = '0' + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = '0' + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ':' + currentSeconds;
    total_duration.textContent = playList[track_index].totalDuration;
  }
}

playList.forEach((el, i) => {
  const li = document.createElement('li');
  li.innerText = 'client';
  li.id = 'key';
  li.className = 'client-class';
  li.setAttribute('onclick', 'playSong()');
  li.onclick = playSong;
  li.classList.add('play-item');
  li.textContent = playList[i].name;
  playListContainer.append(li);
});

const songs = document.querySelectorAll('.play-item');
songs.forEach((e, i) => e.setAttribute('id', i));

// function playSong(e) {
//   let current_index = e.target.id;
//   loadTrack(current_index);
//   playpauseTrack();
// }

function playSong(e) {
  let current_index = e.target.id;
  loadTrack(current_index);
  curr_track.play();
  if (!isPlaying) {
    playpauseBtn.classList.toggle('pause');
  }
  isPlaying = true;
  songs.forEach((el) => el.classList.remove('item-active'));
  // repeatTrack();
}

function setActiveSong() {
  currentSong = document.getElementById(`${track_index}`);
  songs.forEach((el) => el.classList.remove('item-active'));
  currentSong.classList.add('item-active');
}

// Настройка

const timeIcon = document.querySelector('.time-icon'),
  dateIcon = document.querySelector('.date-icon'),
  greetingIcon = document.querySelector('.greeting-icon'),
  quoteIcon = document.querySelector('.quote-icon'),
  weathIcon = document.querySelector('.weath-icon'),
  audioIcon = document.querySelector('.audio-icon'),
  todoIcon = document.querySelector('.todo-icon'),
  settingsIcon = document.querySelector('.settings-icon'),
  allIcons = document.querySelectorAll('.icons');

function toggleHidden() {
  allIcons.forEach((el) => {
    el.classList.toggle('hidden');
  });
}
settingsIcon.addEventListener('click', toggleHidden);

function toggleOpacityTime() {
  time.classList.toggle('opacity');
}

timeIcon.addEventListener('click', toggleOpacityTime);

function toggleOpacityDate() {
  date.classList.toggle('opacity');
}
dateIcon.addEventListener('click', toggleOpacityDate);

const greetingContainer = document.querySelector('.greeting-container');
const quoteContainer = document.querySelector('.quote-wrapper');
const todoContainer = document.querySelector('.todo-wrapper');
const playerContainer = document.querySelector('.player-wrapper');
const weath = document.querySelector('.weather');
const api = document.querySelector('.bg-wrapper');
const apiIcon = document.querySelector('.api-icon');

function toggleOpacityGreeting() {
  greetingContainer.classList.toggle('opacity');
}
greetingIcon.addEventListener('click', toggleOpacityGreeting);

function toggleOpacityQuote() {
  quoteContainer.classList.toggle('opacity');
}
quoteIcon.addEventListener('click', toggleOpacityQuote);

function toggleOpacityApi() {
  api.classList.toggle('opacity');
}
apiIcon.addEventListener('click', toggleOpacityApi);

function toggleOpacityTodo() {
  todoContainer.classList.toggle('opacity');
}
todoIcon.addEventListener('click', toggleOpacityTodo);

function toggleOpacityPlayer() {
  playerContainer.classList.toggle('opacity');
}
audioIcon.addEventListener('click', toggleOpacityPlayer);

function toggleOpacityWeather() {
  weath.classList.toggle('opacity');
}
weathIcon.addEventListener('click', toggleOpacityWeather);

// API

let choiceBg;

if (!choiceBg) {
  choiceBg = 'git';
}

// Слайдер изображений Git///////////////////////////////////////////////

let randomNum;
function getRandomNum() {
  min = Math.ceil(1);
  max = Math.floor(20);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getLinkToImage() {
  let url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=lZ2XWIjdv_fQODDa29M1vv7dDTKWAWK4o9Cuhkk2tp4`;
  let res = await fetch(url);
  const data = await res.json();
  // let img = new Image();
  let link = data.urls.regular;
  body.style.backgroundImage = `url(${link})`;
}

async function getLinkToImageFl() {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=a56496294ff2d5742b92d3ea6afe77ea&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
  let res = await fetch(url);
  const data = await res.json();
  randomNum = getRandomNum();
  let link = data.photos.photo[randomNum].url_l;
  body.style.backgroundImage = `url(${link})`;
}

function setBg() {
  randomNum = getRandomNum();
  let bgNum = randomNum > 9 ? randomNum : '0' + randomNum;

  if (choiceBg == 'git') {
    let img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
      body.style.backgroundImage = `url('${img.src}')`;
    };
  } else if (choiceBg == 'un') {
    getLinkToImage();
  } else if (choiceBg == 'flickr') {
    getLinkToImageFl();
  }
}

setBg();

// Перелистывание изображения///////////////////////////////////////

const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

function getSlideNext() {
  randomNum == 20 ? (randomNum = 1) : (randomNum += 1);
  setBg();
}

function getSlidePrev() {
  randomNum == 1 ? (randomNum = 20) : (randomNum -= 1);
  setBg();
}

/////////////////////////////////////////

const git = document.querySelector('.git');
const un = document.querySelector('.un');
const flickr = document.querySelector('.flickr');

function choiceGit() {
  choiceBg = 'git';
  setBg();
}
git.addEventListener('click', choiceGit);

function choiceUn() {
  choiceBg = 'un';
  setBg();
}
un.addEventListener('click', choiceUn);

function choiceFlickr() {
  choiceBg = 'flickr';
  setBg();
}
flickr.addEventListener('click', choiceFlickr);

// TODO///////////////////////////////////////////////////////////

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') return;

  const parenNode = event.target.closest('.list-group-item');

  const id = Number(parenNode.id);

  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  parenNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.list-group-item');

  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./assets/svg/empty.svg" alt="Empty" class="mt-3">
				</li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="todo-icons">
							<img src="./assets/svg/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="todo-icons">
							<img src="./assets/svg/delete.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
