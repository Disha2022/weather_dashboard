var formCity = document.querySelector('#search-city')
var inputCity = document.querySelector('#cityname')
var apiKey = ('94dd1994e2e5d5cbf8c8a27e72c2477e')

//GET CITY NAME------------------------------------------------------
var formSubmitHandler = async function (event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value (city name) from input element
    var cityName = inputCity.value.trim();

    //Using async await to get location data before getting weather data-------------
    if (cityName) {
        var myData = await getCityLocation(cityName);
        var myLon = myData.coord.lon;
        var myLat = myData.coord.lat;

        await getCurrentWeather(myLat, myLon);
        await getDailyWeather(myLat, myLon);

    } else {
        alert('Please enter a city');
    }
};

// GET LOCATION OF A CITY---------------------------------------------
var getCityLocation = async function (cityName) {

    // format the api url
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey

    // make a get request to url
    return await fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                // Get variables
                return response.json()
            } else {
                alert('Error: ' + response.statusText);
            }
        }).then(function (data) {
            var myLon = data.coord.lon;
            var myLat = data.coord.lat;
            return data

        })


}

//GET WEATHER DATA BASED ON LOCATION------------------------------------------------------------
function getWeatherData(lat, lon) {
    //create new api url with coordinates
    var newApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
        lat + '&lon=' + lon +
        '&exclude=hourly&appid=' + apiKey +
        '&units=imperial';

    //Fetch data with new url
    return fetch(newApiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                alert('Error: ' + response.statusText);
            }
        }).then(function (data) {
            console.log(data)
            return data

        })
}

//GET CURRENT WEATHER-----------------------------------------------------------------------
async function getCurrentWeather(lat, lon) {

    //getting weather data
    var weatherData = await getWeatherData(lat, lon);
    var currentTemp = weatherData.current.temp
    var myWindSpeed = weatherData.current.wind_speed
    var myHumidity = weatherData.current.humidity
    var myUvi = weatherData.current.uvi

    $("#current-temp").text(currentTemp);
    $("#current-wind").text(myWindSpeed);
    $("#current-humidity").text(myHumidity);
    $("#current-uv").text(myUvi);
    if (myUvi > 2 || myUvi === 0) {
        $("#current-uv").addClass("badUv")
    }
    if (myUvi <= 2) {
        $("#current-uv").addClass("goodUv")
    }
}

//GET DAILY WEATHER--------------------------------------------------------------------------

async function getDailyWeather(lat, lon) {

    var weatherData = await getWeatherData(lat, lon);

    for (let i = 0; i < 4; i++) {
        var myWeather = weatherData.daily[i];
        var currentTemp = myWeather.temp
        var myWindSpeed = myWeather.wind_speed
        var myHumidity = myWeather.humidity
        var myUvi = myWeather.uvi
        //Appednd to html

    }
}


///click button------------------------------------------------------------------------------
formCity.addEventListener('submit', formSubmitHandler);



// console.log(data)
// for (let i = 0; i < 4; i++) {
//   var myWeather = data.daily[i];
//   var currentTemp =myWeather.temp
//   var myWindSpeed =myWeather.wind_speed
//   var myHumidity =myWeather.humidity
//   var myUvi =myWeather.uvi

//   $( "div.daily-weather" )
//   .html(`<p>Temp: ${currentTemp} </p>`);
//     // }
// })
// .catch (function(error) {
//   alert('Error: ' + response.statusText);
//   console.log('failed')
// })

// var currentTemp = data.current.temp
// var myWindSpeed = data.current.wind_speed
// var myHumidity = data.current.humidity
// var myUvi = data.current.uvi

// console.log(currentTemp)


// for (let i = 0; i < 4; i++) {
//   var myWeather = data.daily[i];
//   var currentTemp = myWeather.temp
//   var myWindSpeed = myWeather.wind_speed
//   var myHumidity = myWeather.humidity
//   var myUvi = myWeather.uvi


// function appendText() {
//   var txt1 = "<p>Text.</p>";               // Create element with HTML
//   var txt2 = $("<p></p>").text("Text.");   // Create with jQuery
//   var txt3 = document.createElement("p");  // Create with DOM
//   txt3.innerHTML = "Text.";
//   $("body").append(txt1, txt2, txt3);      // Append the new elements
// }

// // var test = $("div.daily-weather")
// //   .html(`<p>Temp: ${currentTemp} </p>`);
// // // }
// // $(current - weather).append(test);