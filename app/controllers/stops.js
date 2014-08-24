'use strict';

var mp = require('multiparty'),
    Stop = require('../models/stop');

exports.create = function(req, res){
  var names = req.body.stop,
      lats  = req.body.stopLat,
      lngs  = req.body.stopLng,
      stops = [];

  for(var i=0; i<names.length; i++){
    stops[i] = {
      tripId: req.params.tripId,
      name: names[i],
      lat: lats[i],
      lng: lngs[i]
    };
  }
  Stop.create(stops, function(stops){
    res.json(stops);
  });
};

exports.show = function(req, res){
  Stop.findById(req.params.stopId, function(stop){
    res.render('trips/trip-stop', {stop:stop});
  });
};

exports.addEvents = function(req, res){
  console.log(req.body.events);
  Stop.findById(req.params.stopId, function(stop){
    stop.addEvents(req.body.events, function(events){
      res.json(events);
    });
  });
};

exports.addPhotos = function(req, res){
  Stop.findById(req.params.stopId, function(stop){
    var form = new mp.Form();
    form.parse(req, function(err, fields, files){
      stop.addPhotos(files, function(){
        res.redirect('/trips/'+req.params.tripId+'/stops/'+req.params.stopId);
      });
    });
  });
};
