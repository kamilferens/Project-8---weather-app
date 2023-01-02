/*
1. Zamienić jednostki tam gdzie potrzeba (np. przy godzinie)
2. Utworzyć wszystkie zmienne do ID VALUE (jakoś tak)
3. Wkelić wszystkie dane do aplikacji za pomocą texcontent 
4. Zastanowić się jak możnabyło to zrobić "czyściej" i zmienić kod 
5. Zrobić kosmetykę taką jak np. przecinki 
6. Wgrać ikonkę 
*/

const localisation = document.querySelector("#localisation");
const temperature = document.querySelector("#temperature-value");
const humidity = document.querySelector("#humidity-value");
const pressure = document.querySelector("#pressure-value");
const cloudiness = document.querySelector("#cloudiness-value");
const windSpeed = document.querySelector("#wind-speed-value");
const sunrise = document.querySelector("#sunrise-value");
const sunset = document.querySelector("#sunset-value");

const weatherIcon = document.getElementById("weather-icon");

/////////////////////////////////////////////

/*Latitude - szerokość geograficzna - zmienna do któej będziemy przypisywali szerokość geograficzną */
let lat;

/*Longtitude - szerokość geograficzna - zmienna do któej będziemy przypisywali długość geograficzną */
let long;

/*Indywidualny kod API dla mojego konta */
const apiKey = "8df53837215d916552fd980dd0b0a817";

function startApp() {
    console.log(navigator.geolocation);

    if (navigator.geolocation) {
        /*W () przekazujemy CALLBACK, który będzie wywołany gdy yżytkownik udostepni 
        pozwolenie na pobranie goeolokalizacji ze swojej przegladarki. */
        navigator.geolocation.getCurrentPosition((e) => {
            lat = e.coords.latitude;
            console.log("Szerokość geograficzna: " + lat);
            long = e.coords.longitude;
            console.log("Długość geograficzna: " + long);
            getWeatherData();
        });
    }
}

/* Funkcja która pobierze nam dane pogodowe z serwera dla "naszej" lokalizacji */
function getWeatherData() {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${"metric"}`;
    console.log(url);

    /*Pobieramy te dane za pomoca FETCH */
    fetch(url)
        .then((response) => response.json())
        .then((data) => implementData(data));
}

function implementData(data) {
    console.log(data);
    console.log("Miasto: ", data.name);
    console.log("szerokość geograficzna: ", data.coord.lat);
    console.log("długość geograficzna: ", data.coord.lon);
    console.log("temperatura: ", data.main.temp);
    console.log("wilgotność: ", data.main.humidity);
    console.log("ciśnienie: ", data.main.pressure);
    console.log("Zachmurzenie: ", data.weather[0]);
    console.log("Zachmurzenie(ikona): ", data.weather[0].icon);
    console.log("wiatr: ", data.wind.speed);
    console.log("Wschód (do obrobienia): ", data.sys.sunrise);
    console.log("Zachód (do obrobienia): ", data.sys.sunset);

    localisation.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)} °C`;
    humidity.textContent = `${data.main.humidity} %`;
    pressure.textContent = `${data.main.pressure} hPa`;
    cloudiness.textContent = `${data.weather[0].description}`;

    let windSpeedString = data.wind.speed;
    windSpeedString = Number.parseFloat(windSpeedString)
        .toFixed(1)
        .toString()
        .replace(".", ",");
    windSpeedString = windSpeed.textContent = `${windSpeedString} m/s`;

    let dateSunrise = new Date(data.sys.sunrise * 1000); // pomnożone *1000, gdyż w JS timestamp musi być przekazany w milisekundach, a tak normalnie to jest w zwykłych sekundach
    sunrise.textContent = `${
        dateSunrise.getHours() + ":" + dateSunrise.getMinutes()
    }`;

    let dateSunset = new Date(data.sys.sunset * 1000);
    sunset.textContent = `${
        dateSunset.getHours() + ":" + dateSunset.getMinutes()
    }`;

    let imgUrl =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    document.getElementById("weather-icon").setAttribute("src", imgUrl);
}

// Ustawienie by po kliknięciu w nazwę miasta przeniosło Nas do map
localisation.href = `https://www.openstreetmap.org/#map=13/${lat}/${long}`;
