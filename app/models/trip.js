'use strict';

var Mongo = require('mongodb'),
    fs    = require('fs'),
    _     = require('lodash'),
    path  = require('path');

function Trip(fields){
  this._id = new Mongo.ObjectID();
  this.tripName = fields.tripName[0];
  this.origin = fields.origin[0];
  this.originLat = parseFloat(fields.originLat[0]);
  this.originLng = parseFloat(fields.originLng[0]);
  this.destination = fields.destination[0];
  this.destinationLat = parseFloat(fields.destinationLat[0]);
  this.destinationLng = parseFloat(fields.destinationLng[0]);
  this.start = new Date(fields.start[0]);
  this.end = new Date(fields.end[0]);
  this.cash = parseFloat(fields.cash[0]);
  this.mpg = parseInt(fields.mpg[0]);
  this.price = parseFloat(fields.price[0]);
  this.stops = [];
  this.carPhoto = '';
  this.distance = parseFloat(fields.distance[0]);
}

Object.defineProperty(Trip, 'collection', {
  get: function(){return global.mongodb.collection('trips');}
});

Trip.create = function(fields, files, cb){
  var trip = new Trip(fields);

  trip.uploadPhoto(files);
  Trip.collection.save(trip, function(){
    cb(trip);
  });
};

Trip.prototype.uploadPhoto = function(photo){
  if (!photo || !photo.size) { return; }
  var baseDir = __dirname + '/../static',
      relDir  = '/img/'+ this._id,
      absDir  = baseDir + relDir,
      ext     = path.extname(photo.path),
      name    = 'vehicle' + ext,
      absPath = absDir + '/' + name,
      relPath  = relDir + '/' + name;

  fs.mkdir(absDir);
  fs.renameSync(photo.path, absPath);

  this.carPhoto = relPath;
};

Trip.findAll = function(cb){
  Trip.collection.find().sort({start:1}).toArray(function(err, trips){
    trips = trips.map(function(trip){
      trip = _.create(Trip.prototype, trip);
      return trip;
    });
    cb(err, trips);
  });
};

Trip.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Trip.collection.findOne({_id:_id}, function(err, trip){
    trip = _.create(Trip.prototype, trip);
    cb(trip);
  });
};

Trip.prototype.getGallons =  function(){
  return this.distance / this.mpg;
};

Trip.prototype.getCost =  function(){
  return this.getGallons() * this.price;
};



module.exports = Trip;
