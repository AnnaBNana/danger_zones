danger_zone.factory('mapFactory', function($http) {
  var factory = {};
  var alerts = [];
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
  return factory;
})
