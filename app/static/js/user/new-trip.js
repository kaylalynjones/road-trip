/* global geocode, google */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button[type=submit]').click(addTrip);
  });

  function addTrip(e){
    var locationOrigin = $('#origin').val(),
        locationDestination = $('#destination').val();
    geocode(locationOrigin, function(origin, lat, lng){
      $('#origin').val(origin);
      $('#originLat').val(lat);
      $('#originLng').val(lng);

      geocode(locationDestination, function(destination, lat, lng){
        $('#destination').val(destination);
        $('#destinationLat').val(lat);
        $('#destinationLng').val(lng);

        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(origin.lat, origin.lng),
          new google.maps.LatLng(destination.lat, destination.lng)
        );
        $('#distance').val(distance);

        $('form').submit();

      });
    });

    e.preventDefault();
  }
})();

