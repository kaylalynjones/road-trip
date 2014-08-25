/* global geocode, google, async, _*/
(function(){
  'use strict';

  var map, stops;

  $('document').ready(function(){
    $('#cloneButton').click(cloneInput);
    $('form').submit(geocodeStops);
    stops = $('#stops > ol > li').toArray().map(function(stop){
      return {
        name: $(stop).find('a').val(),
        lat: $(stop).data('lat'),
        lng: $(stop).data('lng')
      };
    });

    displayDirections();
    addWaypoints();
    initMap(32, 9, 7);
  });

  function initMap(lat, lng, zoom){
    var styles = [{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'water','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#C6E2FF'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'color':'#C5E3BF'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#D1D1B8'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles},
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  function cloneInput(){
    var $last  = $('#addStop .form-group:last-of-type'),
        $clone = $last.clone();
    $clone.find('input').each(function(){
      $(this).val('');
    });
    $last.after($clone);
  }

  function displayDirections(){
    var directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));

    var waypoints = stops.map(function(stop){
      return new google.maps.LatLng(stop.lat, stop.lng);
    });

    if(waypoints.length > 1){
      var origin      = waypoints[0],
          destination = waypoints[waypoints.length - 1];
      waypoints.shift();
      waypoints.pop();

      waypoints = waypoints.map(function(wp){
        return {location:wp, stopover:true};
      });

      var request = {
        origin:origin,
        destination:destination,
        waypoints:waypoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function(response, status){
        if(status === google.maps.DirectionsStatus.OK){
          directionsDisplay.setDirections(response);
        }
      });
    }
  }

  function addWaypoints() {
    $('');
  }

  function geocodeStops(e){
    e.preventDefault();

    var stops = $('input.addStop').toArray().map(function(stop){
      return $(stop).val();
    });

    async.map(stops, iterator, function(err, stops){
      stops.forEach(function(stop, index){
        $('#addStop .form-group').eq(index).find('input#stop').val(stop.name);
        $('#addStop .form-group').eq(index).find('input#stopLat').val(stop.lng);
        $('#addStop .form-group').eq(index).find('input#stopLng').val(stop.lat);
      });
      var data = $('form').serialize(),
          type = $('form').attr('method'),
          url  = $('form').attr('action');
      $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: 'json',
        success: function(results){
          $('#stops #empty').hide();
          _.each(results, function(result){
            $('#stops ol').append('<li><a href="'+window.location.pathname+'/stops/'+result._id+'">'+result.name+'</a></li>');
          });
          $('form#addStop .form-group:not(:first-of-type)').remove();
          $('form#addStop .form-group').find('input').each(function(){
            $(this).val('');
          });
        }
      });
    });

    function iterator(stop, cb){
      geocode(stop, function(name, lat, lng){
        cb(null, {
          name: name,
          lat: lat,
          lng: lng
        });
      });
    }
  }

})();
