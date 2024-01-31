const key = "240771b4b1b42fcd2ef7dfb6183a0853";

async function search() {
  const phrase = document.querySelector('input[type="text"]').value;
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`
  );
  const data = await response.json();
  const ul = document.querySelector("form ul");
  ul.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const { name, lat, lon, country } = data[i];
    ul.innerHTML += `<li data-lat="${lat}" data-lon="${lon}" data-name="${name}">${name}<span>${country}</span></li>`;
  }
}

const debouncedsearch = _.debounce(() => {
  search();
}, 600);

async function showweather(lat, lon, name) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
  );
  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json();
  const temp = Math.round(data.main.temp);
  const feelslike = Math.round(data.main.feels_like);
  const humidity = Math.round(data.main.humidity);
  const wind = Math.round(data.wind.speed);
  const icon = Math.round(data.weather[0].icon);
  document.getElementById("city").innerHTML = name;
  document.getElementById("degrees").innerHTML = temp + "&#8451;";
  document.getElementById("feelslikevalue").innerHTML =
    feelslike + "<span>&#8451;</span>";
  document.getElementById("windvalue").innerHTML = wind + "<span>km/h</span>";
  document.getElementById("humidityvalue").innerHTML =
    humidity + "<span>%</span>";
  document.getElementById(
    "icon"
  ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.querySelector("form").style.display = "none";
  document.getElementById("weather").style.display = "block";
}

document
  .querySelector('input[type="text"]')
  .addEventListener("keyup", debouncedsearch);

document.body.addEventListener("click", (ev) => {
  const li = ev.target;
  const { lat, lon, name } = li.dataset;

  if (!lat) {
    return;
  }

  localStorage.setItem("lat", lat);
  localStorage.setItem("lon", lon);
  localStorage.setItem("name", name);

  showweather(lat, lon, name);
});

document.getElementById("change").addEventListener("click", (ev) => {
  document.getElementById("weather").style.display = "none";
  document.querySelector("form").style.display = "block";
});

document.body.onload = () => {
  if (localStorage.getItem("lat")) {
    const lat = localStorage.getItem("lat");
    const lon = localStorage.getItem("lon");
    const name = localStorage.getItem("name");
    showweather(lat, lon, name);
  }
};
