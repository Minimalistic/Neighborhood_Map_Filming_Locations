var map;
//////// Create an array of locations and their relevant info
locations = [
    {
        title: 'Sanibel Sprout', 
        location: {lat: 26.434856, lng: -82.0791256},
        description: 'An excellent source for fresh fruit/veggie smoothies.'
    },
    {
        title: 'Shelling Beach',
        location: {lat: 26.457203, lng: -82.153015},
        description: 'The sand surrounding Sanibel Island is essentially made up entirely of sea shells, a really fun beach to explore.'
    },
    {
        title: 'Lighthouse Beach',
        location: {lat: 26.452853, lng: -82.014549},
        description: 'Great place to walk around, take photographs.'
    },
    {
        title: 'The Island Cow',
        location: {lat: 26.437499, lng: -82.071067},
        description: 'Excellent food, fun atmosphere.'
    },
    {
        title: 'She Sells Sea Shells',
        location: {lat: 26.436257, lng: -82.078388},
        description: 'While you can find countless shells on the beach nearby, She Sells Sea Shells has a vast array of things to look at and a lot of them are quite pristine.'
    },
    {
        title: 'Red Mangrove Island',
        location: {lat: 26.429486, lng: -82.083688},
        description: 'Main attraction are the tree crabs that can be seen amongst the branches of the Mangrove trees.'
    }
];

var Location = function(data) {
    this.title = data.title;
    this.location = data.location;
    this.description = data.description;
    this.marker = data.marker;
}

var locationsViewModel = function () {
    var self = this;

    this.locationList = ko.observableArray([]);
    // Variable for Google Maps

    // Updates with text input in HTML input box
    this.typedQuery = ko.observable('');

    this.search = ko.computed(function() {
        console.log(self.typedQuery());
    });

    locations.forEach(function(locationItem){
        self.locationList.push(new Location(locationItem) );
    });

    self.openInfoWindow = function(location) {
        google.maps.event.trigger(location.marker, 'click')
    }
};

ko.applyBindings(new locationsViewModel());

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 26.454856, lng: -82.0961250},
        zoom: 12,
    });

    var largeInfowindow = new google.maps.InfoWindow({
        maxWidth:250
    });
    var bounds = new google.maps.LatLngBounds();
    // Following section uses the location array to create a set of markers.
    for (var i = 0; i < locations.length; i++) {
        // Get position from location array.        
        var position = locations[i].location;
        var title = locations[i].title;
        var description = locations[i].description;
        // Create one marker per location and place in markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            description: description,
            animation: google.maps.Animation.DROP,
            id: i,
            map: map

        });

        // Add marker as a property of each Location.
        locations[i].marker = marker;

        // Create onclick event that opens an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });

    }


    // This function populates the infowindow when marker is clicked.
    // Only one infowindow is allowed to be open at a time and it's
    // contents are populated based upon that markers location.
    function populateInfoWindow(marker, infowindow) {
        // Ensure infowindow isn't already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('');
            infowindow.open(map, marker);
            // Ensure marker property is cleared if infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });

            var streetViewService = new google.maps.StreetViewService();
            var radius = 100;
            // If the status is ok, compute streetview position,
            // calculate heading, get panorama and apply settings
            function getStreetView(data, status) {
                if (status == 'OK') {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                        infowindow.setContent('<h2>' + marker.title + '</h2>' + 
                                                '<div id="pano"></div>' +
                                                '<h4>Description</h4>' +
                                                '<p>' + marker.description + '</p>'+
                                                '<h4>Latitude and Longitude</h4>' +
                                                marker.position);
                        var panoramaOptions = {
                            position: nearStreetViewLocation,
                            pov: {
                                heading: heading,
                                pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<h2>' + marker.title + '</h2>' +
                                                '<i>No Street View Available</i>' +
                                                '<div id="pano"></div>' +
                                                '<h4>Description</h4>' +
                                                '<p>' + marker.description + '</p>'+
                                                '<h4>Latitude and Longitude</h4>' +
                                                marker.position);
                    }
                }
                // Find nearest streetview available within 50 meters of marker
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                // Open infowindow on relevant marker.
                infowindow.open(map, marker);
                }
            }

    // Marker styling
    var defaultIcon = makeMarkerIcon('59f9af');

    // Highlighted marker color for mouseover
    var highlightedIcon = makeMarkerIcon('f9e959');

    // Allows a pop up window when user clicks on a marker
    var infowindow = new google.maps.InfoWindow({
        maxWidth:250
    });

    // A function that applies a color to a new marker and defines it's size and origin
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
}
