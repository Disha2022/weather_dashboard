var formCity = document.querySelector('#search-city')
var inputCity = document.querySelector('#cityname')
var apiKey = ('94dd1994e2e5d5cbf8c8a27e72c2477e')

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = inputCity.value.trim();
  console.log(cityName)
  if (cityName) {
    getCityLocation(cityName);

  } else {
    alert('Please enter a city');
  }
};


var getCityLocation = function (cityName) {
  // format the api url

  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        // Get variables
        response.json().then(function (data) {
          var myLon = data.coord.lon;
          var myLat = data.coord.lat;
          var newApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + myLat + '&lon=' + myLon + '&exclude=hourly&appid=' + apiKey;
          console.log(newApiUrl)
          fetch(newApiUrl).then(function (response) {
            if (response.ok) {
              response.json().then(function (data) {
                
                var currentTemp =data.current.temp
                var myWindSpeed =data.current.wind_speed
                var myHumidity =data.current.humidity
                var myUvi =data.current.uvi

                console.log (currentTemp,myHumidity,myWindSpeed,myUvi)

                console.log(data)
                for (let i = 0; i < 4; i++) {
                  var myWeather = data.daily[i];
                  var currentTemp =myWeather.temp
                  var myWindSpeed =myWeather.wind_speed
                  var myHumidity =myWeather.humidity
                  var myUvi =myWeather.uvi

                  $( "div.daily-weather" )
                  .html("<p>Temp:currentTemp </p>");
                }
              })
            } else {
              alert('Error: ' + response.statusText);
              console.log('failed')
            }
          })

        });
      } else {
        alert('Error: ' + response.statusText);
      }

    }
    ).catch((reason) => console.log)


}


formCity.addEventListener('submit', formSubmitHandler);