danger_zone.factory('mapFactory', function($http) {
  var factory = {};
  var alerts = [];
  var news = [];
  // console.log('factory');

  factory.warnings_index = function(callback) {
    $http.get('/warnings').success(function(output) {
      alerts = output;
      callback(alerts);
    })
  }
  factory.alerts_index = function(callback) {
    $http.get('/alerts').success(function(output) {
      alerts = output;
      callback(alerts);
    })
  }
  factory.getNews = function(info, callback) {
    // console.log(info.date);

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

    var final_date = fixDate(info.date);

    info['date'] = final_date;

    $http.post('/news', info).success(function(output) {
      temp_news = output;
      var news = angular.fromJson(temp_news.body);
      callback(news);


    })
  }
  return factory;
})
