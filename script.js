'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(distance, duration, coords) {
    this.distance = distance; // km
    this.duration = duration; // min
    this.coords = coords; // [lat, lng]
  }
}

class Running extends Workout {
  name = 'running';

  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  name = 'cycling';

  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
  }
}
///////////////////////////////////////
// Application Architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Sorry, could not get your current location.');
        }
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling click on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    console.log(mapE);
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();

    // Helper Functions: inputValid() & allPositive()
    const inputValid = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    const allPositive = (...inputs) => inputs.every(input => input > 0);

    // 1. Get input data from form (type, duration, distance, cadence/elevationGain)
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // 2. If type is running, create a running object
    if (type === 'running') {
      // IMPORTANT REMEMBER TO CONVERT TO NUMBER!
      const cadence = +inputCadence.value;
      if (
        // Validate data (Positive numbers)
        !inputValid(duration, distance, cadence) ||
        !allPositive(duration, distance, cadence)
      )
        return alert('Invalid! Inputs need to be positive numbers.');

      workout = new Running(distance, duration, [lat, lng], cadence);
    }

    // 3. If type is cycling, create a cycling object
    if (type === 'cycling') {
      // IMPORTANT Remember to convert string to number using UNARY PLUS! INPUT VALUES ARE STRING!
      const elevation = +inputElevation.value;
      if (
        // Validate data (Positive numbers)
        !inputValid(duration, distance, elevation) ||
        !allPositive(duration, distance)
      )
        return alert('Invalid! Inputs need to be positive numbers.');
      // IMPORTANT Cannot declare workout inside, since CONSTANS ARE BLOCK-SCOPED
      workout = new Cycling(distance, duration, [lat, lng], elevation);
    }

    // 4. Add object into Workouts array
    this.#workouts.push(workout);
    console.log(workout);

    // 5. Render Workouts as markers on map
    this._renderWorkoutMarker(workout);

    // 6. Render Workouts in list

    // 7. Clear input field and Hide form

    // Clear input field
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.name}-popup`,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
