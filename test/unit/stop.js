/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Stop      = require('../../app/models/stop'),
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
    it('should construct a stop object', function(){
      var obj = {name: 'Chicago, IL, USA', lat:'41.8337329', lng:'-87.7321555i'},
         loc = new Stop(obj);
      expect(loc).to.be.instanceof(Stop);
      expect(loc.lat).to.equal(41.8337329);
    });
  });

  describe('.create', function(){
    it('should create and save stop objects', function(done){
      var array = [{
        name: 'Chicago, IL, USA',
        lat:'41.8337329',
        lng:'-87.7321555i'
      },{
        name: 'Nashville, TN, USA',
        lat:'36.1866405',
        lng:'-86.7852455'
      }];
      Stop.create(array, function(stops){
        for(var i=0; i<stops.length; i++){
          expect(stops[i]._id).to.be.instanceof(Mongo.ObjectID);
        }
        done();
      });
    });
  });

});//end
