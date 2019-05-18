// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data.features);


  // Add Clickable popups for every feature element
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Magnitude: " + feature.properties.mag +
      "</p><hr><p> Date: " + new Date(feature.properties.time) + "</p>")
  };


  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  var geolayer = L.geoJSON(data.features, {
    
    // Function to replace markers with circles
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        color: getColor(feature.properties.mag),
        fillcolor: getColor(feature.properties.mag),
        weight: .1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    
    // Set Features Function to add popups to layer group
    onEachFeature: onEachFeature
  });
  
  // Set earthquake data as an overlay layer
  var earthquakes = L.layerGroup([geolayer]);



// If-else functions to get color according to the magnitude of earthquake
  function getColor(d) {
  return d > 5 ? '#581845' :
           d > 4  ? '#900C3F' :
           d > 3  ? '#C70039' :
           d > 2   ? '#FF5733' :
           d > 1   ? '#FFC300' :
           d > 0   ? '#DAF7A6' :
                      '#BBFFAD';
};

// Adjust marker size
function markerSize(mag) {
  return mag * 2.2;
};



// Define streetmap and satellite layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});



// Define a baseMaps object to hold base layers
var baseMaps = {
  "Street Map": streetmap,
  "Satellite Map": satellitemap
};

// Define an overlay object to hold the overlay layers
var overlayMaps = {
  "Earthquakes": earthquakes
};

// Create a new map
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  layers: [streetmap, earthquakes]
});

// Set Legend to Variable with position in bottom right
var legend = L.control({position: 'bottomright'});

// When legend is added, execute function to setup values of legend
legend.onAdd = function (myMap) {

  // Create a div class element to hold legend data 
  var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our magnitude array and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(mags[i]) + '"></i> ' +
            mags[i] + (mags[i+1] ? '&ndash;' + mags[i+1] + '<br>' : '+');
    }

    return div;
};

// Add Legend to Map
legend.addTo(myMap);

// Create a layer control containing our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
});