var map;

// Create a new blank array for all the listing markers.
var markers = [];


function initMap() {
    // Styles array for map.
    // Styling for map from snazzymaps.com - Style name is "Blue Essence" by
    // "Famous Labs" https://twitter.com/famouslabs
    // Direct link to style: https://snazzymaps.com/style/61/blue-essence
    var styles = [ 
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#f4ebc3"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
]
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 26.454856, lng: -82.0791250},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
});

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend boundaries of map for markers and display
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();
// The following group uses the location array to create an array of markers on initialize.
for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var description = locations[i].description;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
        position: position,
        title: title,
        description: description,
        animation: google.maps.Animation.DROP,
        id: i
  });
  // Push the marker to our array of markers.
  markers.push(marker);
  // Create an onclick event to open an infowindow at each marker.
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
}

document.getElementById('show-listings').addEventListener('click', showListings);
document.getElementById('hide-listings').addEventListener('click', hideListings);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
// Check to make sure the infowindow is not already opened on this marker.
if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<ul>' + '<h2>' + marker.title + '</h2>' + 
                                    '<h4>' + 'Description' + '</h4>' +
                                    marker.description +
                                   '<h4>Latitude and Longitude</h4>' + 
                                    marker.position + 
                          '</ul>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
    });
    }
}