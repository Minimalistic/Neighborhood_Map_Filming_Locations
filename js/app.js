// best practice is api_key should be obscured in some way from public, unlike how it is now.
var api_key = 'ff56fc23c898727944c4ccce5862a4c0';
var map;
//////// Create an array of locations and their relevant info
locations = [
    {
        location_name: 'Katz\'s Delicatessen',
        location: {lat: 40.72221649999999, lng: -73.987503},
        description: 'This restaurant was the filming location for the famous scene from "When Harry Met Sally" where Meg Ryan\'s character publicly fakes an orgasm at the table.',
        movie_id: '639'
    },
    {
        location_name: 'Tiffany & Co.',
        location: {lat: 40.762541, lng: -73.97405029999999},
        description: 'Tiffany & Co. was featured in the opening credits of "Breakfast at Tiffany\'s.',
        movie_id: '164'
    },
    {
        location_name: 'New York Public Library',
        location: {lat: 40.75318230000001, lng: -73.98225339999999},
        description: 'The New York Public Library was given the great honor of being a filming location for "Ghostbusters".  The library was the setting for the well known scene where the Ghostbusters crew investigates bizarre supernatural occurences.',
        movie_id: '43074'
    },
    {
        location_name: 'Corleone\'s Residence',
        location: {lat: 40.6065057, lng: -74.09789749999999},
        description: 'This house was depicted as the Corleone\'s family residence from the classic "The Godfather".',
        movie_id: '238'
    },
    {
        location_name: 'Queensboro Bridge',
        location: {lat: 40.757147, lng: -73.95512939999998},
        description: 'Among one of the more consistently filmed bridges in movies, Ed Koch Queensboro Bridge can be seen in movies such as "Spider-Man" to classics such as "Manhattan"',
        movie_id: '696'
    },
    {
        location_name: 'Calvary Cemetery',
        location: {lat: 40.7330559, lng: -73.91410150000002},
        description: 'This cemetary was the setting for an incredibly important scene from The Godfather where the Corleone family attends a funeral.',
        movie_id: '238'
    }
];

var Location = function(data) {
    this.location_name = data.location_name;
    this.location = data.location;
    this.description = data.description;
    this.movie_id = data.movie_id;
    this.marker = data.marker;
    this.showItem = ko.observable(true);
}

var locationsViewModel = function() {
    var self = this;

    this.locationList = ko.observableArray([]);
    // Variable for Google Maps

    this.typedQuery = ko.observable('');

    locations.forEach(function(locationItem){
        self.locationList.push(new Location(locationItem) );
    });

    filteredLocations = ko.computed(function() {
        self.locationList().forEach(function(location) {
            if (self.typedQuery()) {
                var match = location.location_name.toLowerCase().indexOf(self.typedQuery().toLowerCase()) != -1;
                location.showItem(match);
            } else {
                location.showItem(true);
            }
        });
    });

    self.openInfoWindow = function(location) {
        google.maps.event.trigger(location.marker, 'click')
    }
};

var vm = new locationsViewModel();
ko.applyBindings(vm);

function getMovieData(location_name) {
    $.ajax({
        // Temporary url query - ultimately will utilize movie_id which is a movie
        url: 'http://api.themoviedb.org/3/search/movie?api_key=ff56fc23c898727944c4ccce5862a4c0&query=' + location_name,
        dataType: 'jsonp',
        jsonpCallback: 'callback'
    }).done(function(response) {
        for (var i = 0; i < response.results.length; i++) {
            $('#tmdb_results').append('<li>' + response.results[i].title + '</li>');
        }

    });
}
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        // Set map default location showing New York.
        center: {lat: 40.690000, lng: -73.979308},
        zoom: 11,
    });

    var largeInfowindow = new google.maps.InfoWindow({
        maxWidth:250
    });
    var bounds = new google.maps.LatLngBounds();
    // Following section uses the location array to create a set of markers.
    for (var i = 0; i < locations.length; i++) {
        // Get position from location array.        
        var position = locations[i].location;
        var location_name = locations[i].location_name;
        var description = locations[i].description;
        // Create one marker per location and place in markers array.
        var marker = new google.maps.Marker({
            position: position,
            location_name: location_name,
            description: description,
            animation: google.maps.Animation.DROP,
            id: i,
            map: map

        });

        // Add marker as a property of each Location.
        locations[i].marker = marker;

        vm.locationList()[i].marker = marker;

        // Create onclick event that opens an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            getMovieData(this.title);
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
            var radius = 30;
            // If the status is ok, compute streetview position,
            // calculate heading, get panorama and apply settings
            function getStreetView(data, status) {
                if (status == 'OK') {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                        infowindow.setContent('<h2>' + marker.location_name + '</h2>' + 
                                                '<div id="pano"></div>' +
                                                '<h4>Description</h4>' +
                                                '<p>' + marker.description + '</p>'+
                                                '<h4>Latitude and Longitude</h4>' +
                                                marker.position);
                        var panoramaOptions = {
                            position: nearStreetViewLocation,
                            pov: {
                                heading: heading,
                                pitch: 20
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<h2>' + marker.location_name + '</h2>' +
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
