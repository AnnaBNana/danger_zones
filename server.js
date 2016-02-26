var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './client')));

require('./server/config/mongoose.js');

var http = require('http');
var request = require('request');
var parseString = require('xml2js').parseString;
var mongoose = require('mongoose');
var Warning = mongoose.model('Warning');
var CronJob = require('cron').CronJob;

new CronJob('00 00 06 * * 0-6', function() {
  console.log('new warnings stored');
  var url = 'http://travel.state.gov/_res/rss/TWs.xml';
  request(url, function(error, response, body) {
    if(!error) {
      parseString(body, function (err, result) {
          var warnings_arr = result.rss.channel;
          Warning.remove({}, function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log(result)
            }
          })
          var warningInstance = new Warning({data: warnings_arr});
          warningInstance.save(function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log(result);
            }
          })
          console.log(result);
      });

    } else {
      console.log(error);
    }
  })
}, null, true, 'America/Los_Angeles');

new CronJob('00 00 06 * * 0-6', function() {
  console.log('new alerts stored');
  var url = 'http://travel.state.gov/_res/rss/TAs.xml';
  request(url, function(error, response, body) {
    if(!error) {
      parseString(body, function (err, result) {
          // console.dir(result);
          var alerts_arr = result.rss.channel;
          Alert.remove({}, function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log('alerts delete', result);
            }
          })
          var alertInstance = new Alert({data: alerts_arr});
          alertInstance.save(function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log('alerts save', result);
            }
          })
          res.json(result);
      });

    } else {
      console.log(error);
    }
  })

}, null, true, 'America/Los_Angeles');

require('./server/config/routes.js')(app);

app.listen(8000, function() {
  console.log('listening on port 8000')
});
