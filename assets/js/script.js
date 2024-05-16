// Dependencies

const dayElement = $('#current-day');
const timeElement = $('#current-time');
const searchInput = $('#search-input');
const searchBtn = $('#search-btn');
const searchHistory = $('#search-history');
const currentWeather = $('#current-weather');
const forecast = $('#forecast');


// Variables

let city;
const APIKey = "8981449863dd5fafd5e5fe759b2102b5";
let searchURL;
const currentDay = dayjs();


// Functions

// Sets the time and date
function setTimeAndDate() {
    dayElement.text(currentDay.format('dddd, MMMM D'));
    timeElement.text(currentDay.format('h:mm A'));
}

// Gets the weather
function getWeather() {
    searchURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    fetch(searchURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        displayCurrentWeather(data);
    });
}

// Displays the current weather
function displayCurrentWeather(data) {
    $("#current-weather").empty();

    const cityName = data.name;
    const cityCountry = data.sys.country;
    const weatherIcon = data.weather[0].icon;
    const weatherIconURL = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherDescription = data.weather[0].description;
    const temperatureFahrenheit = (temperature * 9 / 5 - 459.67).toFixed(2);
    const temperatureCelsius = (temperature - 273.15).toFixed(2);

    const todaysWeather = $("<div class='justify-content-center align-items-center py-2 text-center' id='todaysWeather'> ");
    const currentWeatherHeader = $("<h3>").text(cityName + ", " + cityCountry);
    const weatherIconElement = $("<img>").attr("src", weatherIconURL);
    const temperatureElement = $("<p>").text("Temperature: " + temperatureFahrenheit + "°F" + " (" + temperatureCelsius + "°C) ");
    const humidityElement = $("<p>").text("Humidity: " + humidity + "% ");
    const windSpeedElement = $("<p>").text("Wind Speed: " + windSpeed + "mph ");
    const weatherDescriptionElement = $("<p>").text("Weather: " + weatherDescription);

    $("#current-weather").append(todaysWeather);

    todaysWeather.append(currentWeatherHeader, weatherIconElement, temperatureElement, humidityElement, windSpeedElement, weatherDescriptionElement);
}

// Gets the forecast
function getForecast() {
    forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
    fetch(forecastQueryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayForecast(data);
        });
}

// Displays the forecast
function displayForecast(data) {
    $("#forecast").empty();
    const headerForecast = $("<h5 class='text-center py-3'>").text("5-Day Forecast");
    $("#forecast").append(headerForecast);

    const forecast = $("<div id='5-day-forecast' class='col-12 row justify-content-center'>");
    for (let i=7; i <= 39; i+=8) {
        const date = data.list[i].dt_txt;
        const weatherIcon = data.list[i].weather[0].icon;
        const weatherIconURL = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        const temperature = data.list[i].main.temp;
        const temperatureFahrenheit = (temperature * 9 / 5 - 459.67).toFixed(2);
        const temperatureCelsius = (temperature - 273.15).toFixed(2);
        const humidity = data.list[i].main.humidity;
        const windSpeed = data.list[i].wind.speed;

        const forecastCard = $("<div class='card col-2'>");
        const forecastCardBody = $("<div class='card-body'>");
        const forecastCardDate = $("<h5>").text(date);
        const forecastIconElement = $("<img>").attr("src", weatherIconURL);
        const forecastTemperatureElement = $("<p>").text("Temperature: " + temperatureFahrenheit + "°F" + " (" + temperatureCelsius + "°C)");
        const forecastHumidityElement = $("<p>").text("Humidity: " + humidity + "%");
        const forecastWindSpeedElement = $("<p>").text("Wind Speed: " + windSpeed + "mph");
        
        forecastCardBody.append(forecastCardDate, forecastIconElement, forecastTemperatureElement, forecastHumidityElement, forecastWindSpeedElement);
        forecastCard.append(forecastCardBody);
        forecast.append(forecastCard);
    }
    $("#forecast").append(forecast);
}  

// Displays the search history
function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem("cities")) || [];
    $("#search-history").empty();

    if(history.length === 0) {
        searchHistory.css("border", "none");
        forecast.css("border", "none");
    } else {
        searchHistory.css("border", "1px solid black");
        forecast.css("border", "1px solid black");
    }

    for(let i = 0; i < history.length; i++) {
        const historyButton = $("<button>").text(history[i]);
        $("#search-history").append(historyButton);

        if (history.length > 0) {
            city = history[0];
            getWeather();
            getForecast();
        }
    }
}

// Event listener for the search button
$("#search-form").on("submit", function(event) {
    event.preventDefault();
    city = $("#search-input").val();
    if (city.trim() !== "") {
        let history = JSON.parse(localStorage.getItem("cities")) || [];
        if (!history.includes(city)) {
            history.unshift(city);
            const maxHistory = 5;
            if (history.length > maxHistory) {
                history.pop();
            }
            localStorage.setItem("cities", JSON.stringify(history));
            displaySearchHistory();
        }    
        getWeather();
        getForecast();
    }
});

// Event listener for the search history buttons
$("#search-history").on("click", function(event) {
    event.preventDefault();
    city = $(event.target).text();
    getWeather();
    getForecast();
});

setTimeAndDate();
displaySearchHistory();
