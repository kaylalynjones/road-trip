/*global _ */
(function(){
  'use strict';

  $('document').ready(function(){
    $('#cloneButton').click(cloneInput);
    $('form#addEvent').submit(addEvent);
  });

  function cloneInput(){
    var $last  = $('#addEvent .form-group:last-of-type'),
        $clone = $last.clone();
    $clone.find('input').val('');
    $last.after($clone);
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

