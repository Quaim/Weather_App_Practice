const mainWeatherSection = document.querySelector("#weatherSection");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const userLocationButton = document.querySelector("#userlocation-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");
// const previousSearchHistory = document.querySelectorAll("#previous-search-history li .namedhistory");
var searchHistoryDiv = document.getElementById("searchHistory");

const searchHistoryContainer = document.getElementById("searchHistoryContainer");

const API_KEY = "045a0084a08118b8ad2136beb78579bf"; //Ellis' API KEY use for TESTING ONLY

// Create weather card HTML based on weather data
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="mt-3 d-flex justify-content-between">
                    <div>
                        <h3 class="fw-bold">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <h6 class="my-3 mt-3">Temperature: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C</h6>
                        <h6 class="my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6 class="my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                    <div class="text-center me-lg-5">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>
                </div>`;
    } else {
        return `<div class="col mb-3">
                    <div class="card border-0 bg-secondary text-white">
                        <div class="card-body p-3 text-white">
                            <h5 class="card-title fw-semibold">(${weatherItem.dt_txt.split(" ")[0]})</h5>  
                            <h6>${weatherItem.weather[0].description}</h6>
                            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather icon">                             
                        </div>
                        <div class="card-body p-3 text-white">                                                                                  
                            <h6 class="card-text my-3 mt-3">Temp: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C</h6>
                            <h6 class="card-text my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                            <h6 class="card-text my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                        </div>                        
                    </div>
                </div>`;
    }
}

// Get weather details of passed latitude and longitude
const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const forecastArray = data.list;
        const uniqueForecastDays = new Set();
        const fiveDaysForecast = forecastArray.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        });
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        daysForecastDiv.innerHTML = "";
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                daysForecastDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
    
}

// Get coordinates of entered city name
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
        addCityToList();
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
    removeHome();
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
                addCityToList();
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
        removeHome();
}

/*
Function needs to take the city name, add it to a array. Take in the HTML for the li & output the array object at index0,1,2,3,4,5 etc replacing the li html
*/
// const presentPreviousHistory = () => {
//     //Get city name
//     let cityName = city.value.trim();
//     //List for  previous city names
//     let citylist = [];
//     //Add searched for city name to list
//     citylist = citylist.push(cityName);
//     console.log(citylist);

//     //Get Search History names, run a loop for every object in array & output the content
//     Array.from(previousSearchHistory).forEach(function(previousSearchHistory) {
//         console.log(previousSearchHistory.textContent);
//     });
// }

// Function to add city to the list
function addCityToList() {
    // Get the text from the city search box
    var name = document.getElementById("city-input").value;

    var list = document.querySelectorAll(".list-group-item");


    // Check if the input is not empty
    if (name.trim() !== "") {
        
       
        // Create a new list item
        var newListItem = document.createElement("li");
        newListItem.className = "list-group-item";
        newListItem.textContent = name;
        
        // Create an empty array to be filled with list items innerHTML
        var listArray=[];
        // Check if list item array
        if(listArray !== "") {
            for (var i=0;i<list.length;i++){
                listArray.push(list[i].innerHTML);
        }
        
        // Get reference to the existing ul
        var searchListUl = document.getElementById("searchList");

        // Append the new list item to the existing ul
        if(!listArray.includes(name)) {
            

            searchListUl.appendChild(newListItem);
        }
    }
    }
}

const removeHome = () => {
    mainWeatherSection.classList.remove('d-none');
    searchHistoryContainer.classList.remove('d-none');
    homePage.classList.add('d-none');
}


//Add event listener
// searchButton.addEventListener("click", () => getCityCoordinates());

userLocationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
// presentPreviousHistory();



