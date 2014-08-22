(function(){
  'use strict';

  $(document).ready(function(){
    $('button[type=submit]').click(addTrip);
  });

  function addTrip(e){
    var locationOrigin = $('#origin').val(),
        locationDestination = $('#destination').val();
    

    e.preventDefault();
  }
})();

