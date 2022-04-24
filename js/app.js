import { INITIAL_NAME, INITIAL_VALUE, MAX_VALUE, MIN_VALUE } from './config.js';

class Counter {
	title = INITIAL_NAME;
	value = INITIAL_VALUE;
	goal = 0;
}

const addCounterBtn = document.querySelector('.button--circle');

class App {
	#counters = [];

	constructor() {
		this._getLocalStorage();

		addCounterBtn.addEventListener('click', this._createCounter.bind(this));
	}

	_createCounter() {
		const counter = new Counter();
		this.#counters.push(counter);

		this._renderCounters();
		this._setLocalStorage();
	}

	_renderCounters() {
		const countersContainer = document.querySelector('.counters');

		countersContainer.innerHTML = '';

		this.#counters.forEach((counter, index) => {
			const counterHTML = document.createElement('div');
			counterHTML.classList.add('counter');
			counterHTML.dataset.index = index;

			counterHTML.innerHTML = `
        <div class="counter__header">
          <input type="text" class="counter__title" value="${counter.title}" spellcheck="false">

          <button class="counter__link" aria-label="Counter options">
            <svg class="counter__icon icon">
              <use
                xlink:href="symbol-defs.svg#icon-dots-three-vertical"
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
          <button type="button" class="counter__button--primary decrease" aria-label="Decrease counter">
            <svg class="counter__button-icon">
              <use xlink:href="symbol-defs.svg#icon-minus"></use>
            </svg>
          </button>

          <button type="button" class="counter__button--primary increase" aria-label="Increase counter">
            <svg class="counter__button-icon">
              <use xlink:href="symbol-defs.svg#icon-plus"></use>
            </svg>
          </button>

          <button class="counter__button--secondary">Set goal</button>
        </div>
      `;
			// Change value and goal styles
			this._changeCounterStyle(counterHTML, counter);

			countersContainer.append(counterHTML);

			const counterTitle = counterHTML.querySelector('.counter__title');
			const counterBtns = counterHTML.querySelector('.counter__buttons');
      const btnOptions = counterHTML.querySelector('.counter__link');
			const btnSetGoal = counterHTML.querySelector(
				'.counter__button--secondary'
			);

			// Change counter title
			counterTitle.addEventListener('input', () =>
				this._changeCounterTitle(counter, counterTitle)
			);

			// Display nav
			btnOptions.addEventListener('click', () => {
				this._displayNav(counter, counterHTML);
			});

			// Change counter value
			counterBtns.addEventListener('click', e => this._changeValue(e, counter));

			// Display popup
			btnSetGoal.addEventListener('click', e => {
				if (!e.target.classList.contains('counter__button--secondary')) return;
				this._displayPopup(e, counter);
			});
		});

		this._setLocalStorage();
	}

	_changeCounterTitle(counter, counterTitle) {
		counter.title = counterTitle.value;
		this._setLocalStorage();
		counterTitle.focus();
	}

	_displayNav(counter, counterHTML) {
		const nav = counterHTML.querySelector('.nav');
		const overlay = document.querySelector('.overlay');

		overlay.classList.remove('overlay--hidden');
		overlay.addEventListener('click', () => this._closeNav(nav, overlay));

		nav.style.display = 'block';

		nav.addEventListener('click', e => {
			if (e.target.getAttribute('id') === 'initial-value')
				this._displayPopup(e, counter);
			if (e.target.getAttribute('id') === 'reset-value')
				this._resetValue(counter);
			if (e.target.getAttribute('id') === 'delete-goal')
				this._deleteGoal(counter);
			if (e.target.getAttribute('id') === 'delete-counter')
				this._deleteCounter(e, counter);

			this._closeNav(nav, overlay);
			this._renderCounters();
		});
	}

	_closeNav(nav, overlay) {
		nav.style.display = 'none';
		overlay.classList.add('overlay--hidden');
	}

	_changeValue(e, counter) {
		// Decrease value
		if (e.target.classList.contains('decrease') && counter.value > MIN_VALUE) {
			counter.value -= 1;
		}
		if (counter.goal && counter.value === counter.goal) return;

		// Increase value
		if (e.target.classList.contains('increase') && counter.value < MAX_VALUE) {
			counter.value += 1;
		}

		this._renderCounters();
	}

	_resetValue(counter) {
		counter.value = 0;
	}

	_deleteGoal(counter) {
		counter.goal = 0;
	}

	_deleteCounter(e) {
		const index = e.target.closest('.counter').dataset.index;
		this.#counters.splice(index, 1);
	}

	_changeCounterStyle(counterHTML, counter) {
		const counterNum = counterHTML.querySelector('.counter__number');
		const counterGoal = counterHTML.querySelector('.counter__goal');

		// Reduce font size
		if (counterNum.innerText.length > 3) {
			counterNum.classList.add('counter__number--small');
		}
		if (counterGoal.innerText.length > 4) {
			counterGoal.classList.add('counter__goal--small');
		}

		// Change value color
		if (counter.value === counter.goal && counter.goal) {
			counterNum.classList.add('counter__number--red');
		}

		// Display goal
		if (counter.goal) counterGoal.style.display = 'block';
	}

	_displayPopup(e, counter) {
		const popupsContainer = document.querySelector('.popups');
		popupsContainer.innerHTML = '';

		const popup = document.createElement('div');
		popup.classList.add('popup');
		popup.innerHTML = `
      <div class="popup__content">
        <button class="popup__button" aria-label="Close popup">
          <svg class="popup__icon">
            <use xlink:href="symbol-defs.svg#icon-cross"></use>
          </svg>
        </button>
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
		const popupIcon = popup.querySelector('.popup__icon');
		const form = popup.querySelector('.form');
		const formInput = document.querySelector('.form__input');

		const clickedBtn = e.target;
		if (clickedBtn.classList.contains('counter__button--secondary')) {
			popupText.innerText = 'Set goal to:';
		}
		if (clickedBtn.getAttribute('id') === 'initial-value') {
			popupText.innerText = 'Set value to:';
		}

		// ============== FORM =============
		form.addEventListener('submit', e => {
			e.preventDefault();
			const inputValue = formInput.value;
			if (!inputValue) return;

			if (clickedBtn.classList.contains('counter__button--secondary')) {
				counter.goal = +inputValue;
				if (counter.goal < counter.value) counter.value = counter.goal;
			}
			if (clickedBtn.getAttribute('id') === 'initial-value') {
				counter.value = +inputValue;
				if (counter.value > counter.goal && counter.goal)
					counter.goal = counter.value;
			}

			this._removePopup(popup);
			this._renderCounters();
		});

		popupIcon.addEventListener('click', () => this._removePopup(popup));
		window.addEventListener('keydown', e => {
			if (e.key === 'Escape') this._removePopup(popup);
		});
	}

	_removePopup(popup) {
		popup.remove();
	}

	// ============= LOCAL STORAGE ==============
	_setLocalStorage() {
		localStorage.setItem('counters', JSON.stringify(this.#counters));
	}

	_getLocalStorage() {
		const data = JSON.parse(localStorage.getItem('counters'));

		if (!data || data.length === 0) {
			this._createCounter();
			return;
		}

		data.forEach((el, i) => {
			this.#counters[i] = el;
		});

		this._renderCounters();
	}
}

const app = new App();
