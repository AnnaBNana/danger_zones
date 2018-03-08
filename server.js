var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './client')));

require('./server/config/mongoose.js');

//dependencies for http requests, parsing xml to json, db, and cron jobs
var http = require('http');
var request = require('request');
var parseString = require('xml2js').parseString;
var mongoose = require('mongoose');
var Warning = mongoose.model('Warning');
var Alert = mongoose.model('Alert');
var CronJob = require('cron').CronJob;

//cron job to handle retrieval of travel warnings from US state dept.
new CronJob('20 21 * * *', function() {
  console.log('new warnings stored');
  //retrieves data from xml file
  var url = 'https://cadatacatalog.state.gov/storage/f/2013-11-24T21%3A00%3A58.223Z/tws.xml';
  request(url, function(error, response, body) {
    if(!error) {
      //parse xml to JSON
      parseString(body, function (err, result) {
          var warnings_arr = result.rss.channel;
          //remove all from database
          Warning.remove({}, function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log(result)
            }
          })
          //replace data in db with results from most recent API call
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

//cron job for call to state dept API to retrieve travel alerts
new CronJob('17 21 * * *', function() {
  console.log('new alerts stored');
  //retrieves data from xml file
  var url = 'https://cadatacatalog.state.gov/storage/f/2013-11-24T21%3A00%3A30.424Z/tas.xml';
  request(url, function(error, response, body) {
    if(!error) {
      //parse xml to json
      parseString(body, function (err, result) {
          // console.dir(result);
          //strip object layers down to essential data
          var alerts_arr = result.rss.channel;
          //remove all content from previous responses from db
          Alert.remove({}, function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log('alerts delete', result);
            }
          })
          //save new data to db
          var alertInstance = new Alert({data: alerts_arr});
          alertInstance.save(function(err, result) {
            if(err) {
              console.log(err);
            } else {
              console.log('alerts save', result);
            }
          })
          console.log(result)
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
