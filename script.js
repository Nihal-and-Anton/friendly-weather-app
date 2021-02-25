const weatherApp = {};
// save API's url and keys into variables
// incapsulate variables into a function "getVariables"
// get user location using FreeGeoIP
// get weather for that location using OpenWeather

weatherApp.getVariables = () => {
    weatherApp.geoUrl = "https://freegeoip.app/json/";
    weatherApp.weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    weatherApp.onecallUrl = "https://api.openweathermap.org/data/2.5/onecall";
    weatherApp.apiKey = "f5daff7dc1836c7459dbcc4ca6644537";
    weatherApp.iconUrl = "https://openweathermap.org/img/wn/"
    //http://openweathermap.org/img/wn/10d@2x.png
    // second API key 'b14a81d4d1d1f082145ed553c87d056f'
};

weatherApp.getLocation = () => {
    fetch(weatherApp.geoUrl)
        .then(response => response.json())
        .then(jsonResponse => {
            const coordinates = {
                latitude: jsonResponse.latitude,
                longitude: jsonResponse.longitude,
            };
            weatherApp.getWeather(coordinates);
            weatherApp.getForecast(coordinates);
        });
};

weatherApp.getWeather = userCoordinates => {
    const url = new URL(weatherApp.weatherUrl);
    url.search = new URLSearchParams({
        lat: userCoordinates.latitude,
        lon: userCoordinates.longitude,
        appid: weatherApp.apiKey
    });

    fetch(url)
        .then(response => response.json())
        .then(jsonResponse => {
            weatherApp.displayWeather(jsonResponse);
            console.log(jsonResponse)
        });
};

weatherApp.displayWeather = weatherObject => {
    document.querySelector('.weather-title')
        .textContent = `Current weather in ${weatherObject.name}`;

    document.getElementById('real-temp')
        .textContent = `${(weatherObject.main.temp - 273.15).toFixed()}°C`;

    document.getElementById('feels-like')
        .textContent = `${(weatherObject.main.feels_like - 273.15).toFixed()}°C`;

    document.getElementById('description')
        .textContent = `${weatherObject.weather[0].description}`;

    const weatherIcon = document.createElement('i');
    weatherIcon.classList.add('wi',`wi-owm-${weatherObject.weather[0].id}`);
    weatherIcon.alt = `${weatherObject.weather[0].description}`;
    document.querySelector('.description').appendChild(weatherIcon);

    document.getElementById('wind-speed')
        .textContent = `${(weatherObject.wind.speed * 3.6).toFixed(1)} km/hr`

    document.getElementById('humidity')
        .textContent = `${weatherObject.main.humidity}%`

};

weatherApp.getForecast = userCoordinates => {
    const url = new URL(weatherApp.onecallUrl);
    url.search = new URLSearchParams({
        lat: userCoordinates.latitude,
        lon: userCoordinates.longitude,
        appid: weatherApp.apiKey
    });

    fetch(url)
        .then(response => response.json())
        .then(jsonResponse => weatherApp.showForecast(jsonResponse));
}

weatherApp.showForecast = forecastData => {
    const currentDate = new Date(forecastData.current.dt * 1000);
    console.log(forecastData)
    
    const currentDateElement = document.querySelector('#current-date');
    currentDateElement.textContent = `${currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit'})}`;

    const currentTimeElement = document.querySelector('#current-time');
    currentTimeElement.textContent = `${currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

    const dailyTemperatureElement = document.querySelector('#current-daily-temperature');
    const dailyHighTemperature = Math.round(forecastData.daily[0].temp.max - 273.15);
    const dailyLowTemperature = Math.round(forecastData.daily[0].temp.min - 273.15);

    dailyTemperatureElement.textContent = `${dailyHighTemperature}°C / ${dailyLowTemperature}°C`;

    const daysOfForecast = document.querySelectorAll('.forecast');

    for (let i = 0; i < daysOfForecast.length; i++) {
        const forecastHeadings = document.querySelectorAll('h4');
        forecastHeadings[i].textContent = new Date(forecastData.daily[i + 1].dt * 1000).toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });
        const forecastTemperatureElement = document.querySelectorAll('.forecast-daily-temperature');
        const forecastHighTemperature = Math.round(forecastData.daily[i+1].temp.max - 273.15);
        const forecastLowTemperature = Math.round(forecastData.daily[i+1].temp.min - 273.15);
        forecastTemperatureElement[i].textContent= `${forecastHighTemperature}°C / ${forecastLowTemperature}°C`;
        const forecastIcon = document.createElement('i');
        forecastIcon.classList.add('wi',`wi-owm-${ forecastData.daily[i + 1].weather[0].id}`);
        forecastHeadings[i].insertAdjacentElement('afterend' , forecastIcon);
    }
}

weatherApp.init = () => {
    weatherApp.getVariables();
    weatherApp.getLocation();
};

weatherApp.init();