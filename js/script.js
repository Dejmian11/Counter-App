/* eslint-disable*/
import { INITIAL_NAME, INITIAL_VALUE, MAX_VALUE, MIN_VALUE } from './config.js';

const addCounterBtn = document.querySelector('.counters__btn');

const counters = [
	{
		title: INITIAL_NAME,
		value: INITIAL_VALUE,
		id: `${Date.now()}`.slice(-10) + 2,
		goal: 0,
	},
	{
		title: INITIAL_NAME,
		value: INITIAL_VALUE,
		id: `${Date.now()}`.slice(-10) + 6,
		goal: 0,
	},
];

// ===================== CREATE COUNTER ================================
const createCounter = () => {
	const counter = {
		title: INITIAL_NAME,
		value: INITIAL_VALUE,
		id: `${Date.now()}`.slice(-10),
		goal: 0,
	};

	counters.push(counter);
	console.log(counters); // test
	renderCounters(counter);
};

addCounterBtn.addEventListener('click', createCounter);

// ===================== RENDER COUNTERS ===============================
const renderCounters = () => {
	const countersContainer = document.querySelector('.counters');

	countersContainer.innerHTML = '';

	counters.forEach(counter => {
		const counterHTML = document.createElement('div');
		counterHTML.classList.add('counter');
		counterHTML.dataset.id = counter.id;
		counterHTML.innerHTML = `
      <div class="counter__header">
        <input type="text" class="counter__title" value="${counter.title}" spellcheck="false">

        <button class="counter__link">
          <svg class="counter__icon icon">
            <use
              xlink:href="img/symbol-defs.svg#icon-dots-three-vertical"
            ></use>
          </svg>
        </button>

        <nav class="nav">
            <ul class="nav__list">
              <li class="nav__element">
                <a href="#" class="nav__link">Initial value</a>
              </li>
              <li class="nav__element">
                <a href="#" class="nav__link">Delete goal</a>
              </li>
              <li class="nav__element">
                <a href="#" class="nav__link">Delete counter</a>
              </li>
            </ul>
          </nav>
      </div>
      <div class="counter__value">
        <div class="counter__number">${counter.value}</div>
        <div class="counter__goal">/${counter.goal}</div>
      </div>
      <div class="counter__buttons">
        <button type="button" class="counter__btn--primary lower">
          <svg class="counter__btn-icon">
            <use xlink:href="img/symbol-defs.svg#icon-minus"></use>
          </svg>
        </button>

        <button type="button" class="counter__btn--primary increase">
          <svg class="counter__btn-icon">
            <use xlink:href="img/symbol-defs.svg#icon-plus"></use>
          </svg>
        </button>

        <button class="counter__btn--secondary">Set goal</button>
      </div>
    `;
		changeNumStyles(counterHTML, counter);
		countersContainer.append(counterHTML);

		const counterBtns = counterHTML.querySelector('.counter__buttons');
		const setGoalBtn = counterHTML.querySelector('.counter__btn--secondary');
		const counterGoal = counterHTML.querySelector('.counter__goal');
		const counterTitle = counterHTML.querySelector('.counter__title');
		const navBtn = counterHTML.querySelector('.counter__link');

		// Display counter goal
		if (counter.goal) counterGoal.style.display = 'block';

		// Change counter name
		counterTitle.addEventListener('input', () =>
			changeCounterTitle(counter, counterTitle)
		);

		// Display nav
		navBtn.addEventListener('click', () => {
			displayNav(counter, counterHTML);
		});

		// Change counter value listener
		counterBtns.addEventListener('click', e => changeValue(e, counter), false);

		// Display popup listener
		setGoalBtn.addEventListener(
			'click',
			e => displayGoalPopup(e, counter),
			false
		);
	});
};

// ===================== CHANGE COUNTER TITLE ==========================
const changeCounterTitle = (counter, counterTitle) => {
	counter.title = counterTitle.value;
	console.log(counters);
};

// ===================== DISPLAY NAV ===================================
const displayNav = (counter, counterHTML) => {
	const nav = counterHTML.querySelector('.nav');
	const overlay = document.querySelector('.overlay');
	overlay.classList.remove('overlay--hidden');
	overlay.addEventListener('click', () => closeNav(nav, overlay));

	nav.style.display = 'block';
};

// ===================== CLOSE NAV =====================================
const closeNav = (nav, overlay) => {
	nav.style.display = 'none';
	overlay.classList.add('overlay--hidden');
};

// ===================== CHANGE COUNTER NUMBER STYLES ==================
const changeNumStyles = (counterHTML, counter) => {
	const counterNum = counterHTML.querySelector('.counter__number');
	const counterGoal = counterHTML.querySelector('.counter__goal');
	if (counterNum.innerText.length > 3) {
		counterNum.classList.add('counter__number--small');
	}
	if (counterGoal.innerText.length > 3) {
		counterGoal.classList.add('counter__goal--small');
	}

	if (counter.value === counter.goal && counter.goal) {
		counterNum.classList.add('counter__number--red');
	}
};

// ===================== CHANGE COUNTER VALUE ==========================
const changeValue = (e, counter) => {
	if (e.target.classList.contains('lower') && counter.value > MIN_VALUE) {
		counter.value -= 1;
	}
	if (counter.goal && counter.value === counter.goal) return;
	if (e.target.classList.contains('increase') && counter.value < MAX_VALUE) {
		counter.value += 1;
	}

	renderCounters();
};

// ===================== DISPLAY GOAL POPUP ============================
const displayGoalPopup = (e, counter) => {
	if (!e.target.classList.contains('counter__btn--secondary')) return;
	const popup = document.querySelector('.popup');
	popup.classList.remove('popup--hidden');
	popup.dataset.id = e.target.closest('.counter').getAttribute('data-id');

	popup
		.querySelector('.popup__icon')
		.addEventListener('click', () => closePopup(popup), false);
	window.addEventListener(
		'keydown',
		e => {
			if (e.key === 'Escape') closePopup(popup);
		},
		false
	);
	const form = popup.querySelector('.form');

	// Set goal listener
	form.addEventListener('submit', e => setGoal(e, counter, popup), false);
};

// ====================== CLOSE POPUP ==================================
const closePopup = popup => {
	popup.classList.add('popup--hidden');
};

// ===================== SET GOAL ======================================
const setGoal = (e, counter, popup) => {
	e.preventDefault();
	const formInput = document.querySelector('.form__input');
	const goal = formInput.value;
	if (!goal) return;

	const popupID = popup.getAttribute('data-id');
	const [currCounter] = counters.filter(counter => counter.id === popupID);

	currCounter.goal = +goal;

	formInput.value = '';
	popup.classList.add('popup--hidden');

	if (currCounter.value > currCounter.goal) {
		currCounter.value = currCounter.goal;
	}

	renderCounters();
};

const init = () => {
	createCounter();
	renderCounters();
};
init();
