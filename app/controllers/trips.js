'use strict';

var mp = require('multiparty');

exports.init = function(req, res){
  res.render('trips/init');
};

exports.index = function(req, res){
  res.render('trips/index');
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    console.log(fields, files);
  });
};

exports.show = function(req, res){
};

