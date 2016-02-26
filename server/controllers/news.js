var http = require('http');
var request = require('request');
var mongoose = require('mongoose');

module.exports = (function() {
  return {
    index:function(req, res) {
      // console.log(req.body.date);
      var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=glocations:(' + req.body.country + ')&page1&begin_date=' + req.body.date +  '& sort=newest&api-key=01b2fb05eb525e892fc97dee393f8634:15:74528666';
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
