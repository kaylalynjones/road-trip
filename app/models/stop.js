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
  Stop.collection.findOne({_id:id}, function(err, stop){
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

Stop.prototype.addPhotos = function(files, cb){
  var dir = __dirname + '/../static/img/' + this._id,
  exist = fs.existsSync(dir),
  self = this;

  if(!exist){
    fs.mkdirSync(dir);
  }

  files.photos.forEach(function(photo){
    var ext = path.extname(photo.path),
        rel = '/img/' + self._id + '/' + self.photos.length + ext,
        abs = dir + '/' + self.photos.length + ext;
    fs.renameSync(photo.path, abs);
    self.photos.push(rel);
  });
  Stop.collection.save(self, cb);
};

Stop.prototype.addEvents = function(events, cb){
  this.events = this.events.concat(events);
  Stop.collection.save(this, function(){
    cb(events);
  });
};

module.exports = Stop;
