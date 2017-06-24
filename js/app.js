// Variable for Google Maps
var gmap;

function LocationsViewModel() {
    var self = this;

    self.availableLocations = [
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
}

ko.applyBindings(new LocationsViewModel());

// Google Maps
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 26.454856, lng: -82.0791250},
        zoom: 13,
    });
}

