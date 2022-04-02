var formCity = document.querySelector('#search-city')
var inputCity = document.querySelector('#cityname')
var apiKey = ('94dd1994e2e5d5cbf8c8a27e72c2477e')

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value (city name) from input element
  var cityName = inputCity.value.trim();
  console.log(cityName)
  if (cityName) {
    getCityLocation(cityName);

  } else {
    alert('Please enter a city');
  }
};

// get location of a city
var getCityLocation = function (cityName) {

  // format the api url
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        // Get variables
        return response.json().then(function (data) {
          var myLon = data.coord.lon;
          var myLat = data.coord.lat;
          getWeatherData(myLat, myLon);

          var currentTemp = data.current.temp
          var myWindSpeed = data.current.wind_speed
          var myHumidity = data.current.humidity
          var myUvi = data.current.uvi

          for (let i = 0; i < 4; i++) {
            var myWeather = data.daily[i];
            var currentTemp = myWeather.temp
            var myWindSpeed = myWeather.wind_speed
            var myHumidity = myWeather.humidity
            var myUvi = myWeather.uvi

            $("div.daily-weather")
              .html(`<p>Temp: ${currentTemp} </p>`);
            // }

          }

        })

      } else {
        alert('Error: ' + response.statusText);
      }

    }).catch((reason) => console.log)


}


function getWeatherData(lat, lon) {
  //create new api url with coordinates
  var newApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&appid=' + apiKey;

  //Fetch data with new url
  fetch(newApiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json()
          .then(function (data) {
            console.log(data)
          }

          )

      }
    })
}

///click button
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

