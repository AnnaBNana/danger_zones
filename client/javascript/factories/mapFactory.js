danger_zone.factory('mapFactory', function($http) {
  var factory = {};
  var alerts = [];
  var news = [];
  console.log('factory');

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
    console.log(info);
    $http.post('/news', info).success(function(output) {
      temp_news = output;
      var news = angular.fromJson(temp_news.body);
      callback(news);


    })
  }
  return factory;
})
