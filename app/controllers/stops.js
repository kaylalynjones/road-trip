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
