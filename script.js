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
    weatherApp.iconUrl = "http://openweathermap.org/img/wn/10d@2x.png"
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
        // .then(jsonResponse => console.log(jsonResponse));
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
    currentDateElement.textContent = `Date: ${currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit'})}`;

    const currentTimeElement = document.querySelector('#current-time');
    currentTimeElement.textContent = `Time: ${currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

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
        forecastTemperatureElement[i].textContent = `${forecastHighTemperature}°C / ${forecastLowTemperature}°C`;
    }
}

weatherApp.init = () => {
    weatherApp.getVariables();
    weatherApp.getLocation();
};

weatherApp.init();
