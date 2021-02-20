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
        .then(jsonResponse => console.log(jsonResponse));
};

weatherApp.init = () => {
    weatherApp.getVariables();
    weatherApp.getLocation();
};

weatherApp.init();
