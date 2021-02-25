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

weatherApp.checkUnit = () => {
    let checked = document.querySelector('input:checked');
    weatherApp.unit = checked.value;

    const selector = document.querySelector('form');
    selector.addEventListener('change', () => {
        checked = document.querySelector('input:checked');
        weatherApp.unit = checked.value;
        weatherApp.getLocation();
    })


}

weatherApp.getWeather = userCoordinates => {
    const url = new URL(weatherApp.weatherUrl);
    url.search = new URLSearchParams({
        lat: userCoordinates.latitude,
        lon: userCoordinates.longitude,
        appid: weatherApp.apiKey,
        units: weatherApp.unit
    });

    fetch(url)
        .then(response => response.json())
        .then(jsonResponse => {
            weatherApp.displayWeather(jsonResponse);
            console.log(jsonResponse)
        });
};

weatherApp.displayWeather = weatherObject => {
    const allIcons = document.querySelectorAll('i:not(h1 i, form i)');
    allIcons.forEach(icon => icon.remove());

    document.querySelector('.weather-title')
        .textContent = `Current weather in ${weatherObject.name}`;

    document.getElementById('real-temp')
        .textContent = `${(weatherObject.main.temp).toFixed()}°`;

    document.getElementById('feels-like')
        .textContent = `${(weatherObject.main.feels_like).toFixed()}°`;

    document.getElementById('description')
        .textContent = `${weatherObject.weather[0].description}`;

    const weatherIcon = document.createElement('i');
    weatherIcon.classList.add('wi', `wi-owm-${weatherObject.weather[0].id}`);
    weatherIcon.alt = `${weatherObject.weather[0].description}`;
    document.querySelector('.description').appendChild(weatherIcon);

    const windIcon = document.createElement('i');
    windIcon.classList.add('wi', 'wi-wind', `towards-${weatherObject.wind.deg}-deg`);
    document.getElementById('wind-speed')
        .textContent = ` ${(weatherObject.wind.speed * 3.6).toFixed(1)} ${weatherApp.unit === 'metric' ? 'km/hr' : 'mph'}`
    document.getElementById('wind-speed').prepend(windIcon);

    document.getElementById('humidity')
        .textContent = `${weatherObject.main.humidity}%`

};

weatherApp.getForecast = userCoordinates => {
    const url = new URL(weatherApp.onecallUrl);
    url.search = new URLSearchParams({
        lat: userCoordinates.latitude,
        lon: userCoordinates.longitude,
        appid: weatherApp.apiKey,
        units: weatherApp.unit
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
    const dailyHighTemperature = Math.round(forecastData.daily[0].temp.max);
    const dailyLowTemperature = Math.round(forecastData.daily[0].temp.min);

    dailyTemperatureElement.textContent = `${dailyHighTemperature}° / ${dailyLowTemperature}°`;

    const daysOfForecast = document.querySelectorAll('.forecast');

    for (let i = 0; i < daysOfForecast.length; i++) {
        const forecastHeadings = document.querySelectorAll('h4');
        forecastHeadings[i].textContent = new Date(forecastData.daily[i + 1].dt * 1000).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit'
        });
        const forecastTemperatureElement = document.querySelectorAll('.forecast-daily-temperature');
        const forecastHighTemperature = Math.round(forecastData.daily[i + 1].temp.max);
        const forecastLowTemperature = Math.round(forecastData.daily[i + 1].temp.min);
        forecastTemperatureElement[i].textContent = `${forecastHighTemperature}° / ${forecastLowTemperature}°`;
        const forecastIcon = document.createElement('i');
        forecastIcon.classList.add('wi', `wi-owm-${ forecastData.daily[i + 1].weather[0].id}`);
        forecastHeadings[i].insertAdjacentElement('afterend', forecastIcon);
    }
}

weatherApp.init = () => {
    weatherApp.getVariables();
    weatherApp.checkUnit();
    weatherApp.getLocation();
};

weatherApp.init();