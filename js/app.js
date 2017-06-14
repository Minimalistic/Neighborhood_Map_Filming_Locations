      var map;
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        // This map is centered over Sanibel Island in Florida.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 26.427688, lng: -82.10251},
          zoom: 13
        });
        var sanibel_sprout = {lat: 26.434856, lng: -82.0791256};
        var marker = new google.maps.Marker({
          position: sanibel_sprout,
          map: map,
          title: 'First Marker!!',
          animation: google.maps.Animation.DROP,
          draggable: true,
          title: "This marker is draggable!"
        });
        var infowindow = new google.maps.InfoWindow({
          content: 'Do you ever feel like an InfoWindow?' +
            ' ready to start again?'
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }