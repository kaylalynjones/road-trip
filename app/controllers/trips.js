'use strict';

var mp = require('multiparty'),
    Trip = require('../models/trip'),
    moment = require('moment');

exports.init = function(req, res){
  res.render('trips/init');
};

exports.index = function(req, res){
  Trip.findAll(function(err, trips){
    console.log(trips);
    res.render('trips/index', {trips:trips, moment:moment});
  });
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Trip.create(fields, files.carPhoto[0], function(){
      res.redirect('/trips');
    });
  });
};

exports.show = function(req, res){
};

