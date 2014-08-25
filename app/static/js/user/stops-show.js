/*global _, google*/
(function(){
  'use strict';
  var map;

  $('document').ready(function(){
    $('#cloneButton').click(cloneInput);
    $('form#addEvent').submit(addEvent);
    var pos = getPosition();
    initMap(pos.lat, pos.lng, 11);
    addMarker(pos.lat, pos.lng, pos.name);
  });

  function cloneInput(){
    var $last  = $('#addEvent .form-group:last-of-type'),
        $clone = $last.clone();
    $clone.find('input').val('');
    $last.after($clone);
  }

  function addMarker(lat, lng, name){
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name,
      animation: google.maps.Animation.DROP
    });
  }

  function getPosition(){
    var $stop = $('#stopValues'),
        name      = $stop.attr('data-name'),
        lat       = $stop.attr('data-lat'),
        lng       = $stop.attr('data-lng'),
        pos       = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};

    return pos;
  }

  function initMap(lat, lng, zoom){
    var styles = [{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'water','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#C6E2FF'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'color':'#C5E3BF'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#D1D1B8'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function addEvent(e){
    e.preventDefault();

    var data = $('form').serialize(),
        type = $('form').attr('method'),
        url  = $('form').attr('action');
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: 'json',
      success: function(results){
        $('#events #empty').hide();
        _.each(results, function(result){
          $('#events ul').append('<li>'+result+'</li>');
        });
        $('form#addEvent .form-group:not(:first-of-type)').remove();
        $('form#addEvent .form-group').find('input').each(function(){
          $(this).val('');
        });
      }
    });
  }
})();

