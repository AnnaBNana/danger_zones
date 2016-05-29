var http = require('http');
var request = require('request');
var mongoose = require('mongoose');
var moment = require('moment');
var times = require('../../api_key.json');

module.exports = (function() {
  return {
    index:function(req, res) {
      var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=glocations:(' + req.body.country + ')&page1&begin_date=' + req.body.date +  '& sort=newest&api-key=' + times.key;
      console.log(url)
      request(url, function(error, response, body) {
        if(!error) {
          res.json(response);
        } else {
          console.log(error);
        }
      })
    }
  }
})();
