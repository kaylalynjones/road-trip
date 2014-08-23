/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Trip      = require('../../app/models/trip'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'road-trip-test';

describe('Trip', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Trip object', function(){
      var fields = {
          //_id: '000000000000000000000001',
          tripName:['Bob and Sandys Great Adventure'],
          origin:['Nashville, TN, USA'],
          originLat:['36.166667'],
          originLng:['-86.78333299999997'],
          destination:['Anchorage, AK, USA'],
          destinationLat:['61.2180556'],
          destinationLng:['-149.90027780000003'],
          distance: 1000,
          start:['2014-08-21'],
          end:['2014-09-10'],
          cash:['500.00'],
          mpg:['25'],
          price:['3.00']
        },
        vaca = new Trip(fields);
      expect(vaca).to.be.instanceof(Trip);
      expect(vaca.originLat).to.equal(36.166667);
      expect(vaca.mpg).to.equal(25);
      expect(vaca.start).to.be.instanceof(Date);
      expect(vaca._id).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should create and save a new trip', function(done){
      var fields = {
          tripName:['Bob and Sandys Great Adventure'],
          origin:['Nashville, TN, USA'],
          originLat:['36.166667'],
          originLng:['-86.78333299999997'],
          destination:['Anchorage, AK, USA'],
          destinationLat:['61.2180556'],
          destinationLng:['-149.90027780000003'],
          start:['2014-08-21'],
          end:['2014-09-10'],
          cash:['500.00'],
          distance:[1000],
          mpg:['25'],
          price:['3.00']
        };
      Trip.create(fields, null, function(trip){
        expect(trip._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all trips', function(done){
      Trip.findAll(function(err, trips){
        expect(trips).to.have.length(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a trip by its id', function(done){
      var id = '53f8fb61ed43f7ed19c4dbde';
      Trip.findById(id, function(trip){
        expect(trip.tripName).to.equal('West Coast Tour');
        done();
      });
    });
  });
});
