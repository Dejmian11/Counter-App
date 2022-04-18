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

	counters.forEach((counter, index) => {
		const counterHTML = document.createElement('div');
		counterHTML.classList.add('counter');
		counterHTML.dataset.id = counter.id;
		counterHTML.dataset.index = index;

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
                <button id="initial-value" class="nav__button">Initial value</button>
              </li>
              <li class="nav__element">
                <button id="reset-value" class="nav__button">Reset value</button>
              </li>
              <li class="nav__element">
                <button id="delete-goal" class="nav__button">Delete goal</button>
              </li>
              <li class="nav__element">
                <button id="delete-counter" class="nav__button">Delete counter</button>
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
			e => {
				if (!e.target.classList.contains('counter__btn--secondary')) return;
				displayPopup(e, counter);
			},
			false
		);
	});
};

// ===================== CHANGE COUNTER TITLE ==========================
const changeCounterTitle = (counter, counterTitle) => {
	counter.title = counterTitle.value;
};

// ===================== RESET COUNTER =================================
const resetValue = counter => {
	counter.value = 0;
	renderCounters();
};

// ===================== DELETE GOAL ===================================
const deleteGoal = counter => {
	counter.goal = 0;
	renderCounters();
};

// ===================== DELETE COUNTER ================================
const deleteCounter = (e) => {
  const index = e.target.closest('.counter').dataset.index;
  counters.splice(index, 1)
  renderCounters();
}

// ===================== DISPLAY NAV ===================================
const displayNav = (counter, counterHTML) => {
	const nav = counterHTML.querySelector('.nav');
	const overlay = document.querySelector('.overlay');  

	overlay.classList.remove('overlay--hidden');
	overlay.addEventListener('click', () => closeNav(nav, overlay));

	nav.style.display = 'block';

	nav.addEventListener('click', e => {

		if (e.target.getAttribute('id') === 'initial-value')
			displayPopup(e, counter);
		if (e.target.getAttribute('id') === 'reset-value') resetValue(counter);
		if (e.target.getAttribute('id') === 'delete-goal') deleteGoal(counter);
		if (e.target.getAttribute('id') === 'delete-counter')
			deleteCounter(e, counter);

		closeNav(nav, overlay);
	});
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

// ===================== DISPLAY POPUP =================================
const displayPopup = (e, counter) => {
	const popupsContainer = document.querySelector('.popups');
	popupsContainer.innerHTML = '';

	const popup = document.createElement('div');
	popup.classList.add('popup');
	popup.innerHTML = `
    <div class="popup__content">
      <div class="popup__icon-container">
        <svg class="popup__icon">
          <use xlink:href="img/symbol-defs.svg#icon-cross"></use>
        </svg>
      </div>
      <p class="popup__text"></p>
      <form action="#" class="form">
        <input
          type="number"
          class="form__input"
          placeholder="1"
          min="${MIN_VALUE + 1}"
          max="${MAX_VALUE}"
        />
        <button class="form__button">Set</button>
      </form>
    </div>
  `;

	popupsContainer.appendChild(popup);
	const popupText = popup.querySelector('.popup__text');
	const form = popup.querySelector('.form');
	const formInput = document.querySelector('.form__input');

	const clickedElement = e.target;
	if (clickedElement.classList.contains('counter__btn--secondary')) {
		popupText.innerText = 'Set goal to:';
	}
	if (clickedElement.getAttribute('id') === 'initial-value') {
		popupText.innerText = 'Set value to:';
	}

	form.addEventListener('submit', e => {
		e.preventDefault();
		const inputValue = formInput.value;
		if (!inputValue) return;

		// ROZDZIELIC NA 2 FUNKCJE  !!!!!!!!!!!!!!!!!!!!!!!!!!!
		if (clickedElement.classList.contains('counter__btn--secondary')) {
			counter.goal = +inputValue;
			if (counter.goal < counter.value) counter.value = counter.goal;
		}
		if (clickedElement.getAttribute('id') === 'initial-value') {
			counter.value = +inputValue;
			if (counter.value > counter.goal && counter.goal)
				counter.goal = counter.value;
		}

		removePopup(popup);
		renderCounters();
	});

	popup
		.querySelector('.popup__icon')
		.addEventListener('click', () => removePopup(popup));
	window.addEventListener('keydown', e => {
		if (e.key === 'Escape') removePopup(popup);
	});
};

// ====================== REMOVE POPUP =================================
const removePopup = popup => {
	popup.remove();
};

const init = () => {
	createCounter();
	renderCounters();
};
init();
