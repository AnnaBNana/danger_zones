var http = require('http');
var request = require('request');

module.exports = (function() {
  return {
    index:function(req, res) {

      // console.log(req.body.date);


      var fixDate = function(date) {
        // console.log(date);
        var temp_date = date.split(" ");
        var year = temp_date[3];
        var temp_month = temp_date[2];
        var month = getMonthFromString(temp_month);
        if (month < 10) {
          month = "0" + month
        }
        var day = temp_date[1];
        var date = year + month + day;

        function getMonthFromString(mon){
           var d = Date.parse(mon + "1, 2012");
           if(!isNaN(d)){

              return new Date(d).getMonth() + 1;
           }
           return -1;
         }
         return date;
      }

      var final_date = fixDate(req.body.date);
      // console.log(final_date);



      var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=glocations:(' + req.body.country + ')&page1&begin_date=' + final_date +  '& sort=newest&api-key=01b2fb05eb525e892fc97dee393f8634:15:74528666';
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
