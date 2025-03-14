// Initialize the map
const map = L.map('map').setView([37.8, -96], 4); // Center on the US

// Add a base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load the point data (USA_Major_Cities.geojson)
let cityData;
fetch('data/USA_Major_Cities.geojson')
  .then(response => response.json())
  .then(data => {
    cityData = data;

    // Add the cities to the map
    L.geoJSON(cityData, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        const name = feature.properties.NAME;
        const population = feature.properties.POPULATION;
        layer.bindPopup(`<b>${name}</b><br>Population: ${population.toLocaleString()}`);
      }
    }).addTo(map);
  });

// Add a click event to the map
map.on('click', function (e) {
  if (!cityData) return; // Ensure city data is loaded

  // Get the clicked location
  const clickedLocation = turf.point([e.latlng.lng, e.latlng.lat]);

  // Find the nearest city
  const nearestCity = turf.nearestPoint(clickedLocation, cityData);

  // Get the nearest city's properties
  const name = nearestCity.properties.NAME;
  const population = nearestCity.properties.POPULATION;
  const distance = turf.distance(clickedLocation, nearestCity, { units: 'miles' }).toFixed(2);

  // Display a popup with the nearest city's information
  L.popup()
    .setLatLng(e.latlng)
    .setContent(`<b>Nearest City:</b> ${name}<br>
                 <b>Population:</b> ${population.toLocaleString()}<br>
                 <b>Distance:</b> ${distance} miles`)
    .openOn(map);
});