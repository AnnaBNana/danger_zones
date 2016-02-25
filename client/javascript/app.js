var danger_zone = angular.module('danger_zone', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngAria']);

danger_zone.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '../partials/map.html'
    })
    .otherwise({
      redirectTo: '/'
    });
    $mdThemingProvider.theme('default').primaryPalette('red');
});
