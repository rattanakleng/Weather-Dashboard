// Create variable
var inputEl = $("#input-el");
var searchBtn = $("#search-btn");
var currentDateEl = $("#current-date");
var currentUvIconEl = $("#uv-index-icon")
var currentTempEl = $("#current-temp");
var currentHumidityEl = $("#current-humidity");
var currentWindSpeedEl = $("#current-wind-speed");
var currentUvIndexEl = $("#current-uv-index");
var apiKey = "544512cbb03ba4363e8ccc18ac64de29";
//var latitute
var lat;
//var latitute
var lon;
var cityName = "";
var allCityName = [];
var forcastCardCtner = $(".forcast-card");
var lastSearchCity;
var buttonCtner = $("#button-container");




pageStartDisplay()

localStorage.getItem("cityNameWDash");

for (var i = allCityName.length - 1; i >= 0; i--) {
    console.log(allCityName[i]);
}

// apiRequestCurrent weather
function currentWeatherRequest() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    $.ajax({

        url: queryURL,
        method: "GET"

    }).then(function (currentWeather) {

        // console.log(currentWeather);

        //display weather icon in html
        var weatherIconEl = $("#weather-icon");
        var iconCode = currentWeather.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        weatherIconEl.attr("src", iconUrl);

        //display current temperature in html
        currentTempEl.text(currentWeather.main.temp);

        // display humidity in html
        currentHumidityEl.text(currentWeather.main.humidity);
        // display current wind speed in html (MPH)
        currentWindSpeedEl.text(Math.floor(currentWeather.wind.speed / 0.681818));

        //return lat and lon
        lat = currentWeather.coord.lat

        lon = currentWeather.coord.lon

        requestUVI()
    });
}

// api request UV index
function requestUVI() {
    var queryURLUVI = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    $.ajax({
        url: queryURLUVI,
        method: "GET"
    }).then(function (responseUvi) {

        var currentUvi = $("#current-uv-index");
        currentUvi.text(responseUvi.value)

        if (responseUvi.value < 3) {

            currentUvi.css("background-color", "#289500");

        } else if (responseUvi.value >= 3 && responseUvi.value < 6) {

            currentUvi.css("background-color", "#F7E400");

        } else if (responseUvi.value >= 6 && responseUvi.value < 8) {

            currentUvi.css("background-color", "#F85900");

        } else if (responseUvi.value >= 8 && responseUvi.value < 11) {

            currentUvi.css("background-color", "#D80010");

        } else {

            currentUvi.css("background-color", "#6B49C8");
        }
    });
}


// Api request 5 days forcast and display info in cards

function requestForcast() {

    var queryURLForcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;

    $.ajax({

        url: queryURLForcast,
        method: "GET"

    }).then(function (responseForcast) {

        displayForcast()

        // Display 5 days forcast
        function displayForcast() {

            for (var i = 0; i < 33; i = i + 8) {
                // Get date(s)
                var forcastDate = (moment(responseForcast.list[i].dt_txt).format('L'));

                // Get temp
                var forcastTemp = responseForcast.list[i].main.temp

                // Get humidity
                var forcastHumid = responseForcast.list[i].main.humidity;
                // console.log(forcastHumid);

                // // Get windspeed
                var forcastWind = Math.floor(responseForcast.list[i].wind.speed / 0.681818);
                // console.log(forcastWind);

                // Get weather icon
                var focastIconCode = responseForcast.list[i].weather[0].icon;
                // console.log(focastIconCode);

                var forcastIconUrl = "http://openweathermap.org/img/wn/" + focastIconCode + ".png"
                // var forcarstIconEl = "<img src='" + forcastIconUrl + "'>";

                // Push all information to cards
                $(".forcast-card").each(function () {

                    if ($(this).data("number") === i) {

                        $(this).append($("<h3 class='is-size-4'></h3>").text(forcastDate));

                        $("<img />").attr("src", forcastIconUrl).appendTo($(this));

                        $(this).append($("<h3 class='is-size-5'></h3>").text(`Temperature: ${forcastTemp} F`));

                        $(this).append($("<h3 class='is-size-5'></h3>").text(`Humidity: ${forcastHumid} %`));

                        $(this).append($("<h3 class='is-size-5'></h3>").text(`Wind Speed: ${forcastWind} MPH`));
                    }
                });
            };
        };
    });
};

// Submit search when click enter
$("#input-el").keyup(function (event) {

    if (event.which === 13) {
        event.preventDefault();
        searchBtn.click();
    }
});

// Add eventListener to searchBtn to run all function

searchBtn.click(function () {

    cityName = inputEl.val();
    // If input is empty exit function
    if (cityName == "") {
        return;
    }

    lastSearchCity = inputEl.val();

    localStorage.setItem("lastSearchCity-WD", lastSearchCity)

    // Clear all information in card
    forcastCardCtner.empty();

    // Get cityName from input
    $("#city-name").text(cityName);

    allCityName.push(cityName);


    // get the current time and date
    // Save cityName to local storage

    localStorage.setItem("cityNameWDash", allCityName);

    addHisBtn()

    inputEl.val("");

    currentWeatherRequest();
    requestForcast();

});




function addHisBtn() {

    buttonCtner.prepend(`<button class="new-btn button is-fullwidth my-0 is-align-left" data-name="${cityName}"> ${cityName} </button>`);
};

// Display information when previouse city click
buttonCtner.on("click", ".new-btn", function () {

    var pastCityName = $(this).data("name");

    forcastCardCtner.empty();

    cityName = pastCityName;

    $("#city-name").text(cityName);

    currentWeatherRequest();
    requestForcast();
});



// Display last search city when page load
function pageStartDisplay() {

    // Get current hour and date
    $("#current-date").text(moment().format('L'));

    cityName = localStorage.getItem("lastSearchCity-WD");

    $("#city-name").text(cityName);

    currentWeatherRequest();

    requestForcast();

    displayPreSeachCity();

}

// Display search history button
function displayPreSeachCity() {
    storedCity = [];
    var prevStoreCity = localStorage.getItem("cityNameWDash")
    var storedCity = prevStoreCity.split(",");

    for (var i = 0; i < storedCity.length; i++) {

        buttonCtner.prepend(`<button class="new-btn button is-fullwidth my-0 is-align-left" data-name = ${storedCity[i]}> ${storedCity[i]} </button>`);

    }
}
