const map = document.querySelector("#map");
const input = document.querySelector("#location");
const suggestions = document.querySelector("#suggestions");
const wind_value = document.querySelector("#wind");
const precipitation_value = document.querySelector("#precipitation");
const temperature_value = document.querySelector("#temperature");

input.addEventListener("input", async() => {
    const valor = input.value;

    try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${valor}&apiKey=718a7c7043064d25b914ec946d88bb28`);
        const data = await response.json();
        suggestions.innerHTML = ""
        data.features.slice(0, 3).forEach((item) => {
            const city = item.properties.city || "No disponible";
            const country = item.properties.country;

            const lon = item.geometry.coordinates[0];
            const lat = item.geometry.coordinates[1];
            
            const li = document.createElement("li");
            li.textContent = `${city} | ${country}`;

            li.addEventListener("click", () => {
                input.value = `${city} | ${country}`;
                suggestions.innerHTML = "";
                map.innerHTML = "";
                showMap(lon, lat);
                weather(lon, lat)
            });
            
            suggestions.appendChild(li);
    });
        
    } catch(error) {
        console.log(error);
    }
    
});

const showMap = (lon, lat) => {
    map.innerHTML = `
                <img src="https://maps.geoapify.com/v1/staticmap?style=osm-liberty&width=600&height=400&center=lonlat:${lon},${lat}&zoom=13&apiKey=718a7c7043064d25b914ec946d88bb28" ></img>
                    `
}


const weather = async (lon, lat)=>{
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_speed_10m,temperature_80m,precipitation`);
    const data = await response.json();
    const wind = data.hourly.wind_speed_10m[0];
    const temperature = data.hourly.temperature_80m[0];
    const precipitacion = data.hourly.precipitation[0];
    wind_value.textContent = `${wind} Km/h`;
    temperature_value.textContent = `${temperature} C°`
    precipitation_value.textContent = `${precipitacion} mm`;
};



