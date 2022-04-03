$(function () {
    var formCity = document.querySelector('#search-city')
    var inputCity = document.querySelector('#city-name')
    var apiKey = ('94dd1994e2e5d5cbf8c8a27e72c2477e')

    // first time will result in null so defaulting to array with some cities
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ||
        ["Austin",
            "Chicago",
            "New York",
            "Orlando",
            "San Francisco",
            "Seattle",
            "Denver",
            "Atlanta"];

    const citiesHistory = $('#cities-history');
    for (let i = 0; i < searchHistory.length; i++) {
        const cityName = searchHistory[i];
        addCityHistoryListItem(cityName)
    }
    function addCityHistoryListItem(cityName) {
        var myLi = $("<li></li>");
        var myBtn = $("<button></button>")
        myBtn.text(cityName);
        myLi.append(myBtn);
        myLi.on("click", function (event) {
            inputCity.value = $(this).text()
            formSubmitHandler(event);
        })
        citiesHistory.append(myLi);

    }


    //GET CITY NAME------------------------------------------------------
    var formSubmitHandler = async function (event) {
        // prevent page from refreshing
        event.preventDefault();

        // get value (city name) from input element
        var cityName = inputCity.value.trim();

        // Using async await to get location data before getting weather data-------------
        if (cityName) {
            $("#location").text(cityName);
            // Don't add city to history if it already is there
            if (!searchHistory.includes(cityName)) {
                addCityHistoryListItem(cityName);
                searchHistory.push(cityName);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
            }

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
        var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' +
            cityName + '&appid=' + apiKey

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
            })
    }

    // API gives unix UTC
    // this must be x1000 to convert to JS Date
    function formatDate(dt) {
        return new Date(dt * 1000).toLocaleDateString(
            'en-us' // this gives MM/DD/YYYY
        );
    }

    //GET CURRENT WEATHER-----------------------------------------------------------------------
    async function getCurrentWeather(lat, lon) {
        //getting weather data
        var weatherData = await getWeatherData(lat, lon);
        var currentTemp = weatherData.current.temp
        var myWindSpeed = weatherData.current.wind_speed
        var myHumidity = weatherData.current.humidity
        var myUvi = weatherData.current.uvi

        var iconId = weatherData.current.weather[0].icon
        // returns a 100 by 100 pixel icon
        var myIconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
        $("#current-image").attr("src", myIconUrl);

        var formattedDate = formatDate(weatherData.current.dt);
        $("#location-date").text(formattedDate)

        $("#current-temp").text(currentTemp);
        $("#current-wind").text(myWindSpeed);
        $("#current-humidity").text(myHumidity);
        $("#current-uv").text(myUvi);
        if (myUvi <= 2) {
            $("#current-uv").removeClass("medium-uv bad-uv")
            $("#current-uv").addClass("good-uv")
        }
        if (myUvi > 2 && myUvi < 5) {
            $("#current-uv").removeClass("good-uv bad-uv")
            $("#current-uv").addClass("medium-uv")
        }
        if (myUvi >= 5) {
            $("#current-uv").removeClass("medium-uv good-uv")
            $("#current-uv").addClass("bad-uv")
        }
    }

    //GET DAILY WEATHER--------------------------------------------------------------------------

    async function getDailyWeather(lat, lon) {
        var weatherData = await getWeatherData(lat, lon);
        console.log(weatherData)
        var forecastContainer = $("#forecast-container");
        forecastContainer.empty();
        for (let i = 1; i < 6; i++) {
            var myWeather = weatherData.daily[i];
            var dateContainer =$("<section></section>");

            // Append to html
            var myh4 = document.createElement("h4");
            myh4.innerHTML = formatDate(myWeather.dt);
            dateContainer.append(myh4)

            var myIcon = $("<img></img>");
            var iconId = myWeather.weather[0].icon
            // returns a 100 by 100 pixel icon
            var myIconUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png"
            myIcon.attr("src", myIconUrl);
            dateContainer.append(myIcon);

            var myTemp = document.createElement("p");
            myTemp.innerHTML = myWeather.temp.day + " &deg;F"
            dateContainer.append(myTemp);

            var myWindSpeed = document.createElement("p");
            myWindSpeed.innerHTML = myWeather.wind_speed + " MPH"
            dateContainer.append(myWindSpeed);

            var myHumidity = document.createElement("p");
            myHumidity.innerHTML = myWeather.humidity + " %"
            dateContainer.append(myHumidity);

            forecastContainer.append(dateContainer);
        }
    }


    ///click button------------------------------------------------------------------------------
    formCity.addEventListener('submit', formSubmitHandler);

}); // end document page ready