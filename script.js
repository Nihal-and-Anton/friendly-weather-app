const weatherApp = {};

// define all global variables and store within method
weatherApp.getVariables = () => {
    weatherApp.geoUrl = "https://freegeoip.app/json/";
    weatherApp.weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    weatherApp.onecallUrl = "https://api.openweathermap.org/data/2.5/onecall";
    weatherApp.apiKey = "f5daff7dc1836c7459dbcc4ca6644537";
    // second API key 'b14a81d4d1d1f082145ed553c87d056f'
};

// get user geolocation based on their IP address
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
        })
        .catch(errors => alert('Data cannot be loaded at the moment. Try disabling your ad-blocker and refreshing the page.'));
};

// check user's preferred temperature unit
weatherApp.checkUnit = () => {
    let checked = document.querySelector('input:checked');
    weatherApp.unit = checked.value;
    const selector = document.querySelector('form');
    selector.addEventListener('change', () => {
        checked = document.querySelector('input:checked');
        weatherApp.unit = checked.value;
        weatherApp.getLocation();
    })
};

// use coordinates received from geolocation to get weather information
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
            weatherApp.setBackground(jsonResponse.weather);
        })
        .catch(errors => alert('Data cannot be loaded at the moment. Try disabling your ad-blocker and refreshing the page.'));
};

// set background image dynamically based on current weather conditions at user's location
weatherApp.setBackground = weatherArray => {
    const bg = weatherArray[0].icon;
    const body = document.querySelector('body');
    body.style.backgroundImage = `url("./assets/backgrounds/${bg}.jpg")`;
};

// display weather information received from getWeather method
weatherApp.displayWeather = weatherObject => {
    // clear any icons on page if method is called again (after unit selection changed) 
    const allIcons = document.querySelectorAll('i:not(h1 i, form i)');
    allIcons.forEach(icon => icon.remove());
    
    document.querySelector('.weather-title')
    .textContent = `Current Weather in ${weatherObject.name}`;
    
    document.getElementById('real-temp')
    .textContent = `${Math.round(weatherObject.main.temp)}°`;
    
    document.getElementById('feels-like')
    .textContent = `${Math.round(weatherObject.main.feels_like)}°`;
    
    document.getElementById('description')
    .textContent = `${weatherObject.weather[0].description}`;
    
    const weatherIcon = document.createElement('i');
    weatherIcon.classList.add('wi', `wi-owm-${weatherObject.weather[0].id}`);
    document.querySelector('.description').appendChild(weatherIcon);
    
    const windSpeed = document.getElementById('wind-speed');
    const windMultiplier = (weatherApp.unit === 'metric' ? 3.6 : 1);
    windSpeed.textContent = ` ${Math.round(weatherObject.wind.speed * windMultiplier)} ${weatherApp.unit === 'metric' ? 'km/hr' : 'mph'}`;
    const windIcon = document.createElement('i');
    windIcon.classList.add('wi', 'wi-wind', `towards-${weatherObject.wind.deg}-deg`);
    windSpeed.prepend(windIcon);
    
    document.getElementById('humidity')
    .textContent = `${weatherObject.main.humidity}%`;
};

// use coordinates received from geolocation to get 5-day forecast information
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
        .then(jsonResponse => weatherApp.showForecast(jsonResponse))
        .catch(errors => alert('Data cannot be loaded at the moment. Try disabling your ad-blocker and refreshing the page.'));
};

// display 5-day forecast received from getForecast method
weatherApp.showForecast = forecastData => {
    const currentDate = new Date(forecastData.current.dt * 1000);

    const currentDateElement = document.querySelector('#current-date');
    currentDateElement.textContent = `${currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit'})}`;

    const currentTimeElement = document.querySelector('#current-time');
    currentTimeElement.textContent = `${currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

    const dailyTemperatureElement = document.querySelector('#current-daily-temperature');
    const dailyHighTemperature = Math.round(forecastData.daily[0].temp.max);
    const dailyLowTemperature = Math.round(forecastData.daily[0].temp.min);

    dailyTemperatureElement.textContent = `${dailyHighTemperature}° / ${dailyLowTemperature}°`;

    const daysOfForecast = document.querySelectorAll('.forecast');

    document.querySelectorAll('.forecast-description').forEach(description => {
        description.remove();
    });

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
    
        const forecastDescription = document.createElement('span');
        forecastDescription.textContent = forecastData.daily[i + 1].weather[0].description;
        forecastDescription.classList.add('sr-only', 'forecast-description');
        forecastIcon.insertAdjacentElement('afterend', forecastDescription);
    }
    weatherApp.makeIconsAriaHidden();
};

// find all icons on page and set them to 'aria-hidden: true'
weatherApp.makeIconsAriaHidden = () => {
    const icons = document.querySelectorAll('i');
    icons.forEach(icon => icon.setAttribute('aria-hidden', true));
};

// define method to initialize app
weatherApp.init = () => {
    weatherApp.getVariables();
    weatherApp.checkUnit();
    weatherApp.getLocation();
};

// call initialization method
weatherApp.init();