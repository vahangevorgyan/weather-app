// You can get your API key from https://openweathermap.org/
const api_key = "API_KEY";

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "flex";
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
  }, 500);
}

function getIcon(weather) {
  let icon = "";
  if (weather === "Clear") {
    icon = "fas fa-sun";
  } else if (weather === "Clouds") {
    icon = "fas fa-cloud";
  } else if (weather === "Rain" || weather === "Drizzle") {
    icon = "fas fa-cloud-showers-heavy";
  } else if (weather === "Thunderstorm" || weather === "Squall") {
    icon = "fas fa-bolt";
  } else if (weather === "Snow") {
    icon = "fas fa-snowflake";
  } else if (
    weather === "Mist" ||
    weather === "Smoke" ||
    weather === "Haze" ||
    weather === "Fog"
  ) {
    icon = "fas fa-smog";
  } else if (
    weather === "Dust" ||
    weather === "Sand" ||
    weather === "Ash" ||
    weather === "Tornado"
  ) {
    icon = "fas fa-wind";
  } else {
    icon = "fas fa-sun";
  }
  return `<i class="fa-solid ${icon}"></i>`;
}

async function fetchWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}&units=metric`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        deleteLocation(location, location.replace(" ", "").toLowerCase());
        alert("Location not found!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
}

function loadLatestWeatherData() {
  const savedLocations = getSavedLocations();
  const weatherContainer = document.querySelector(".weather-section");
  weatherContainer.innerHTML = `<div class="weather-card" id="addlocation">
                                  <div class="plus-circle">
                                    <i class="fas fa-plus"></i>
                                  </div>
                                  <span>Add new location</span>
                                </div>`;

  const openModalBtn = document.getElementById("addlocation");
  openModalBtn.onclick = function () {
    openModal("addlocationmodal");
  };

  savedLocations.forEach(async (location) => {
    const weatherData = await fetchWeather(location);
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");
    weatherCard.id = weatherData.name?.replace(" ", "").toLowerCase();

    const weatherIcon = document.createElement("div");
    weatherIcon.innerHTML = getIcon(weatherData.weather[0].main);
    weatherIcon.classList.add("weather-icon");

    const locationName = document.createElement("h2");
    locationName.textContent = weatherData.name;
    locationName.classList.add("location-name");

    const weatherDescription = document.createElement("p");
    weatherDescription.textContent = weatherData.weather[0].description;
    weatherDescription.classList.add("weather-description");

    const temperature = document.createElement("p");
    temperature.textContent = `${parseInt(weatherData.main.temp)}°C`;
    temperature.classList.add("temperature");

    weatherCard.appendChild(weatherIcon);
    weatherCard.appendChild(locationName);
    weatherCard.appendChild(weatherDescription);
    weatherCard.appendChild(temperature);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () =>
      deleteLocation(
        location,
        weatherData.name?.replace(" ", "").toLowerCase()
      );
    weatherCard.appendChild(deleteBtn);

    weatherContainer.appendChild(weatherCard);
  });
}

function getSavedLocations() {
  const savedLocations = localStorage.getItem("locations");
  return savedLocations ? JSON.parse(savedLocations) : [];
}

async function saveLocation(event) {
  event.preventDefault();
  const input = document.querySelector(".location-input");
  const location = input.value;

  const savedLocations = getSavedLocations();
  const locationExists = savedLocations.some((loc) => loc === location);
  if (locationExists) return;

  savedLocations.push(location);
  localStorage.setItem("locations", JSON.stringify(savedLocations));
  closeModal("addlocationmodal");
  input.value = "";
  loadLatestWeatherData();
}

function deleteLocation(location, id) {
  const savedLocations = getSavedLocations();
  const updatedLocations = savedLocations.filter((loc) => loc !== location);
  localStorage.setItem("locations", JSON.stringify(updatedLocations));
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
  // loadLatestWeatherData();
}

window.onload = function () {
  loadLatestWeatherData();

  const modal = "addlocationmodal";
  const closeBtn = document.getElementsByClassName("close-btn")[0];

  closeBtn.onclick = function () {
    closeModal(modal);
  };

  window.onclick = function (event) {
    const modalElement = document.getElementById(modal);
    if (event.target === modalElement) {
      closeModal(modal);
    }
  };
};
