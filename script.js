'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map,mapEvent;

class Workout {
    date = new Date();
    id = Date.now();
    constructor(coords,distance,duration) {
        this.coords = coords;
        this.duration = duration;
        this.distance = distance;
    }

}

class Running extends Workout {
    constructor(coords,distance,duration,cadence) {
        super(coords,distance,duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        this.pace = this.duration/this.distance;
    }
}

class Cycling extends Workout {
    constructor(coords,distance,duration,elevation) {
        super(coords,distance,duration);
        this.elevation = elevation;
        this.calcSpeed();
    }

    calcSpeed() {
        this.pace = this.distance/(this.duration/60);  // km/hr
    }
}
let run1 = new Running([30,-39],25,30,100);
let cyc1 = new Cycling([20,-11],100,60,250);
console.log(run1);
console.log(cyc1);

////////////////////////////////////////////////
class App {
    #map;
    #mapEvent;
    #workout = [];
    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this));

        inputType.addEventListener('change',this._toggleElevationField.bind(this));
    }

    _getPosition() {
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
            alert('Please allow location access!!!')
        })
    }

    _loadMap(position) {
            // console.log(position);
            // console.log(position.coords.latitude);
            // console.log(position.coords.longitude);
            // let longitude = position.coords.longitude;
            // let latitude = position.coords.latitude;
            let {longitude} = position.coords;
            let {latitude} = position.coords;
            let coords = [latitude,longitude];
            // console.log(longitude,latitude);
            this.#map = L.map('map').setView(coords, 13);
        
            L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
        
            this.#map.on('click',this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        // const validInp = function(...input) {
        //     console.log(input);
        //     input.every(function(inp) {
        //         console.log(Number.isFinite(inp));
        //         return Number.isFinite(inp);
        //     })
        // }

        e.preventDefault();
        
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);
        const {lat,lng} = this.#mapEvent.latlng;
        let workout;
        console.log(type,distance,duration);

        if(type === 'running') {
            const cadence = Number(inputCadence.value);

            if(
                !Number.isFinite(duration) ||
                !Number.isFinite(distance) ||
                !Number.isFinite(cadence)  ||
                cadence < 0 ||
                duration < 0 ||
                distance < 0
            ) {
                return alert('Input is to be a positive number');
            }
            workout = new Running([lat,lng],distance,duration,cadence);
            
        }
        if(type === 'cycling') {
            const elevation = Number(inputElevation.value);

            if(
                !Number.isFinite(duration) ||
                !Number.isFinite(distance) ||
                !Number.isFinite(elevation) ||
                elevation < 0 ||
                duration < 0 ||
                distance < 0
            ) {
                return alert('Input is to be a positive number');
            }
            workout = new Running([lat,lng],distance,duration,elevation);
        }

        this.#workout.push(workout);
        console.log(workout);
        // Clearing input fields
        inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';

        console.log(mapEvent);
        
        console.log([lat,lng]);
        L.marker([lat,lng]).addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 300,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        }))
        .setPopupContent('Workout')
        .openPopup();
    }
}

const obj = new App();


