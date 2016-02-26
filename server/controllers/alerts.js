var http = require('http');
var request = require('request');
var parseString = require('xml2js').parseString;
var mongoose = require('mongoose');
var Alert = mongoose.model('Alert');

module.exports = (function() {
  return {
    index:function(req, res) {
      Alert.find({}, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          res.json(results);
        }
      })
    }
  }
})();
