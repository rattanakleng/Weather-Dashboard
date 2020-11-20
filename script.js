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
// var allCityName = [];
var allCityName = JSON.parse(localStorage.getItem("cityNameWDash")) || [];

var forcastCardCtner = $(".forcast-card");
var lastSearchCity;

var buttonCtner = $("#button-container");


pageStartDisplay()

searchBtn.click(function () {

    cityName = toTitleCase(inputEl.val());

    if (!(isNaN(cityName))) {

        inputEl.empty();
        alert("City not found! Please try again!");
        return;
    }

    // Clear all information in card
    forcastCardCtner.empty();

    currentWeatherRequest();

    inputEl.val("");

});

// localStorage.getItem("cityNameWDash");

// for (var i = allCityName.length - 1; i >= 0; i--) {
//     console.log(allCityName[i]);
// }

// apiRequestCurrent weather
function currentWeatherRequest() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    $.ajax({

        url: queryURL,
        method: "GET",
        error: function () {
            inputEl.empty();
            alert("City not found! Please try again!");
            return;
        }

    }).then(function (currentWeather) {

        // console.log(currentWeather);
        // Get cityName from input
        $("#city-name").text(cityName);
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

        requestForcast();

        allCityName.push(cityName);

        compareCityName();

        spliceAllCityName();

        searchedCityList();

        lastSearchCity = allCityName.slice(-1);

        localStorage.setItem("lastSearchCity-WD", lastSearchCity);
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

// Function compare input value to city list, update city list, and store in local storage

function compareCityName() {
    // allCityName.sort();
    allCityName.forEach(function (value, index, arr) {
        var first_index = arr.indexOf(value);
        var last_index = arr.lastIndexOf(value);

        if (first_index !== last_index) {
            allCityName.pop();

        }
    })
}

// Function limit number of city list / button

function spliceAllCityName() {

    if (allCityName.length > 3) {

        allCityName.splice(allCityName[0], 1);
        console.log(allCityName);
    }
}

function searchedCityList() {

    buttonCtner.empty();

    for (var i = 0; i < allCityName.length; i++) {

        buttonCtner.prepend(`<button class="new-btn button is-fullwidth my-0 is-align-left" data-name = "${allCityName[i]}"> ${allCityName[i]} </button>`);

    }

    localStorage.setItem("cityNameWDash", JSON.stringify(allCityName));
};

// Display information when previouse city click
buttonCtner.on("click", ".new-btn", function () {

    var pastCityName = $(this).attr("data-name");
    console.log(pastCityName);

    forcastCardCtner.empty();

    cityName = pastCityName;

    $("#city-name").text(cityName);

    currentWeatherRequest();
    // requestForcast();
});

// Display last search city when page load
function pageStartDisplay() {

    //spliceAllCityName()

    // Get current hour and date
    $("#current-date").text(moment().format('L'));

    cityName = localStorage.getItem("lastSearchCity-WD");

    $("#city-name").text(cityName);

    currentWeatherRequest();

    displayPreSeachCity();
}

// Display search history button
function displayPreSeachCity() {

    for (var i = 0; i < allCityName.length; i++) {

        buttonCtner.prepend(`<button class="new-btn button is-fullwidth my-0 is-align-left" data-name = "${allCityName[i]}"> ${allCityName[i]} </button>`);
    }
}

{/* <form>
    Input:
  <br /><textarea name="input" onchange="form.output.value=toTitleCase(this.value)" onkeyup="form.output.value=toTitleCase(this.value)"></textarea>
    <br />Output:
  <br /><textarea name="output" readonly onclick="select(this)"></textarea>
</form> */}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}