import { INITIAL_NAME, INITIAL_VALUE, MAX_VALUE, MIN_VALUE } from './config.js';

class Counter {
	name = INITIAL_NAME;
	value = INITIAL_VALUE;
	target = 0;
}

const addCounterBtn = document.querySelector('.btn--circle');
const counterTemp = document.querySelector('.counter-temp');
const popupTemp = document.querySelector('.popup-temp');

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

		this.#counters.forEach(counter => {
			const counterHTML = counterTemp.content.cloneNode(true);
			const counterBtnName = counterHTML.querySelector('.counter__btn-name');
			const counterName = counterHTML.querySelector('.counter__btn-name div');
			const counterForm = counterHTML.querySelector('.counter__form');
			const counterFormBtn = counterHTML.querySelector('.counter__form-btn');
			const counterFormInput = counterHTML.querySelector(
				'.counter__form-input'
			);
			const counterValue = counterHTML.querySelector('.counter__value');
			const counterTarget = counterHTML.querySelector('.counter__target');
			const counterBtns = counterHTML.querySelector('.counter__btns');
			const btnOptions = counterHTML.querySelector('.counter__btn-options');
			const btnSetTarget = counterHTML.querySelector(
				'.counter__btn--secondary'
			);
			const nav = counterHTML.querySelector('.nav');

			counterName.innerText = counter.name;
			counterValue.innerText = counter.value;
			counterTarget.innerText = '/' + counter.target;

			// Change value and target styles
			this._changeCounterStyle(counterValue, counterTarget, counter);

			countersContainer.append(counterHTML);

			// Display counter name input
			counterBtnName.addEventListener('click', () =>
				this._displayCounterNameInput(
					counterForm,
					counterFormInput,
					counterBtnName
				)
			);

			// Change counter name
			counterFormBtn.addEventListener('click', e => {
				this._changeCounterName(e, counter, counterForm, counterBtnName);
			});

			// Display nav
			btnOptions.addEventListener('click', () => {
				this._displayOptions(counter, nav);
			});

			// Change counter value
			counterBtns.addEventListener('click', e => this._changeValue(e, counter));

			// Display popup
			btnSetTarget.addEventListener('click', e => {
				if (e.target.classList.contains('counter__btn--secondary'))
					this._displayPopup(e, counter);
			});
		});

		this._setLocalStorage();
	}

	_displayCounterNameInput(counterForm, counterFormInput, counterBtnName) {
		counterBtnName.style.display = 'none';
		counterForm.style.display = 'flex';
		counterFormInput.focus();
	}

	_changeCounterName(e, counter, counterForm, counterBtnName) {
		e.preventDefault();
		const counterFormInput = counterForm.querySelector('.counter__form-input');

		if (counterFormInput.value.length === 0) {
			alert('Counter name must contain at least one character!');
			return false;
		}

		counter.name = counterFormInput.value;
		counterForm.style.display = 'none';
		counterBtnName.style.display = 'flex';

		this._setLocalStorage();
		this._renderCounters();
	}

	_displayOptions(counter, nav) {
		const overlay = document.querySelector('.overlay');

		overlay.classList.remove('overlay--hidden');
		overlay.addEventListener('click', () => this._closeOptions(nav, overlay));

		nav.style.display = 'block';

		nav.addEventListener('click', e => {
			if (e.target.getAttribute('id') === 'initial-value')
				this._displayPopup(e, counter);
			if (e.target.getAttribute('id') === 'reset-value')
				this._resetValue(counter);
			if (e.target.getAttribute('id') === 'delete-target')
				this._deleteTarget(counter);
			if (e.target.getAttribute('id') === 'delete-counter')
				this._deleteCounter(e, counter);

			this._closeOptions(nav, overlay);
			this._renderCounters();
		});
	}

	_closeOptions(nav, overlay) {
		nav.style.display = 'none';
		overlay.classList.add('overlay--hidden');
	}

	_changeValue(e, counter) {
		// Decrease value
		if (e.target.classList.contains('decrease') && counter.value > MIN_VALUE) {
			counter.value -= 1;
		}
		if (counter.target && counter.value === counter.target) return;

		// Increase value
		if (e.target.classList.contains('increase') && counter.value < MAX_VALUE) {
			counter.value += 1;
		}

		this._renderCounters();
	}

	_resetValue(counter) {
		counter.value = 0;
	}

	_deleteTarget(counter) {
		counter.target = 0;
	}

	_deleteCounter(e) {
		const index = e.target.closest('.counter').dataset.index;
		this.#counters.splice(index, 1);
	}

	_changeCounterStyle(counterValue, counterTarget, counter) {
		// Reduce font size
		if (counterValue.innerText.length > 3) {
			counterValue.classList.add('counter__value--small');
		}
		if (counterTarget.innerText.length > 4) {
			counterTarget.classList.add('counter__target--small');
		}

		// Change value color
		if (counter.value === counter.target && counter.target) {
			counterValue.classList.add('counter__value--red');
		}

		// Display target
		if (counter.target) counterTarget.style.display = 'block';
	}

	_displayPopup(e, counter) {
		const popupsContainer = document.querySelector('.popups');
		const popup = popupTemp.content.cloneNode(true);
		const popupTitle = popup.querySelector('.popup__title');
		const popupCloseBtn = popup.querySelector('.popup__btn');
		const form = popup.querySelector('.form');
		const formInput = popup.querySelector('.form__input');
		const clickedBtn = e.target;

		popupsContainer.innerHTML = '';

		popupsContainer.appendChild(popup);

		if (clickedBtn.classList.contains('counter__btn--secondary')) {
			popupTitle.innerText = 'Set your target';
		}
		if (clickedBtn.getAttribute('id') === 'initial-value') {
			popupTitle.innerText = 'Set a new counter value';
		}

		// ============== FORM =============
		form.addEventListener('submit', e => {
			e.preventDefault();
			const inputValue = formInput.value;
			if (!inputValue) return;

			if (clickedBtn.classList.contains('counter__btn--secondary')) {
				counter.target = +inputValue;
				if (counter.target < counter.value) counter.value = counter.target;
			}
			if (clickedBtn.getAttribute('id') === 'initial-value') {
				counter.value = +inputValue;
				if (counter.value > counter.target && counter.target)
					counter.target = counter.value;
			}

			this._removePopup(popupsContainer);
			this._renderCounters();
		});

		popupCloseBtn.addEventListener('click', () =>
			this._removePopup(popupsContainer)
		);
		window.addEventListener('keydown', e => {
			if (e.key === 'Escape') this._removePopup(popupsContainer);
		});
	}

	_removePopup(popupsContainer) {
		popupsContainer.innerHTML = '';
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
