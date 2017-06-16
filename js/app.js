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
    ];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 26.454856, lng: -82.0791250},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    // Marker styling
    var defaultIcon = makeMarkerIcon('59f9af');

    // Highlighted marker color for mouseover
    var highlightedIcon = makeMarkerIcon('f9e959');

    // Allows a pop up window when user clicks on a marker
    var largeInfowindow = new google.maps.InfoWindow();

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
            icon: defaultIcon,
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
        // Event listeners for mouseover and mouseout of markers
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
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
            // Clear infowindow content to allow streetview time to load
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

            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // If the status is ok, compute streetview position,
            // calculate heading, get panorama and apply settings
            function getStreetView(data, status) {
                if (status == google.maps.StreetViewService.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                        infowindow.setContent('<div>' + marker.title +  
                                                '</div><div id="pano"></div>');
                    var panoramaOptions = {
                            position: nearStreetViewLocation,
                            pov: {
                                heading: heading,
                                pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(document.getElementById(elementId), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Available</div>');
                    }
                }
                // Find nearest streetview available within 50 meters of marker
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                // Open infowindow on relevant marker.
                infowindow.open(map, marker);
                }
            }

    // Basic function for showing marker listings in window
    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend boundaries of map for markers and display
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    // Hide existing marker listings from view
    function hideListings() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }


    // Applies a color to a new marker and defines it's size and origin
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }
