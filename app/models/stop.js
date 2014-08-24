'use strict';

var Mongo = require('mongodb'),
    fs    = require('fs'),
    _     = require('lodash'),
    path  = require('path');

function Stop(obj){
  this._id = new Mongo.ObjectID();
  this.tripId = Mongo.ObjectID(obj.tripId);
  this.name = obj.name;
  this.lat = parseFloat(obj.lat);
  this.lng = parseFloat(obj.lng);
  this.photos = [];
  this.events = [];
}

Object.defineProperty(Stop, 'collection', {
  get: function(){return global.mongodb.collection('stops');}
});

Stop.create = function(array, cb){
  var stops = array.map(function(stop){
    return new Stop(stop);
  });
  Stop.collection.insert(stops, function(err, stops){
    cb(stops);
  });
};

Stop.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  Stop.collection.findOne({_id:id}, function(stop){
    cb(_.create(Stop.prototype, stop));
  });
};

Stop.findByTripId = function(id, cb){
  id = Mongo.ObjectID(id);
  Stop.collection.find({tripId:id}).toArray(function(err, results){
    var stops = results.map(function(stop){
      return _.create(Stop.prototype, stop);
    });
    cb(stops);
  });
};

module.exports = Stop;
