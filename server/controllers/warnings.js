var http = require('http');
var request = require('request');
var parseString = require('xml2js').parseString;

module.exports = (function() {
  return {
    index:function(req, res) {
      var url = ' http://travel.state.gov/_res/rss/TWs.xml';
      request(url, function(error, response, body) {
        if(!error) {
          parseString(body, function (err, result) {
              // console.dir(result);
              res.json(result);
          });

        } else {
          console.log(error);
        }
      })
    }
  }
})();
