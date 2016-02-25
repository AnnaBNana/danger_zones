danger_zone.controller('mapController', function($scope, $sce, $location, $routeParams, mapFactory) {
  //scope variables declaration;
  $scope.warnings = [];
  $scope.country_names = [['Country', 'Alert Level']];
  $scope.alerts = [];
  $scope.selected_county = "";
  $scope.arrayPositon = 0;

    //load google charts and call draw maps function
    google.charts.load('current', {'packages':['geochart']});
    google.charts.setOnLoadCallback(drawRegionsMap);

    //function to draw google geochart map
    function drawRegionsMap() {

      //supplies data to geochart in the form of an array containing country name and alert level.  this tells geochart which countries to highlight and in what color
      var data = google.visualization.arrayToDataTable(
        $scope.country_names
      );

      //set map options
      var options = {
        dataMode: 'regions',
        colorAxis: {colors: ['#FFEE58', '#FFEE58', '#EF5350']},
        backgroundColor: '#4FC3F7',
        datalessRegionColor: '#C8E6C9'
      };

      var chart = new google.visualization.GeoChart(document.getElementById('map'));

      chart.draw(data, options);
      function myClickHandler(){
          var selection = chart.getSelection();
          var message = '';
          for (var i = 0; i < selection.length; i++) {
              var item = selection[i];
              if (item.row != null && item.column != null) {
                  message += '{row:' + item.row + ',column:' + item.column + '}';
              } else if (item.row != null) {
                  message += '{row:' + item.row + '}';
              } else if (item.column != null) {
                  message += '{column:' + item.column + '}';

              }

          }

          $scope.name = $scope.country_names[item.row + 1][0];
          // console.log($scope.name);
          $scope.row = item.row;
          // console.log($scope.row);

          for (var i = 0; i < $scope.alerts.length; i++) {
            if ($scope.alerts[i].title[0] == $scope.name) {
              $scope.selected_text = $scope.alerts[i].description[0];
              $scope.arrayPosition = i;
              $scope.selection = 'Alert';
              // console.log($scope.selected_text)
            }
          }
          for (var j = 0; j < $scope.warnings.length; j++) {
            if ($scope.warnings[j].title[0] == $scope.name) {
              $scope.selected_text = $scope.warnings[j].description[0];
              $scope.arrayPosition = j;
              $scope.selection = 'Warning';
              // console.log($scope.selected_text);
            }
          }

          $scope.selected_country = $scope.name;

          console.log($scope.arrayPosition);
          $scope.country_card = true;
          // console.log($scope.country_card);
          $scope.$apply();
      }

      google.visualization.events.addListener(chart, 'select', myClickHandler);

      chart.draw(data, options);
      // console.log(data);
  }
  google.load('visualization', '1', {packages: ['geochart'], callback: drawRegionsMap});

  mapFactory.alerts_index(function(data) {
    $scope.alerts = data.rss.channel[0].item;
    alertCountryNameConverter();
    console.log('alerts', $scope.alerts);
  })

  mapFactory.warnings_index(function(data) {
    $scope.warnings = data.rss.channel[0].item;
    // console.log($scope.alerts);
    warningCountryNameConverter();
    // console.log('warnings', $scope.warnings);
  });

  var warningCountryNameConverter = function() {
    for (x in $scope.warnings) {
      var temp = $scope.warnings[x].title[0].split(" ");
      temp.splice((temp.length - 2), 2);
      var name = temp.join(" ");
      $scope.warnings[x].title[0] = name;
      var name_array = [name, 800];
      $scope.country_names.push(name_array);
    }
  }
  var alertCountryNameConverter = function() {
    for (x in $scope.alerts) {
      var temp = $scope.alerts[x].title[0].split(" ");
      temp.splice((temp.length - 2), 2);
      var name = temp.join(" ");
      $scope.alerts[x].title[0] = name;
      var name_array = [name, 400];
      $scope.country_names.push(name_array);
    }
  }
  $scope.deliberatelyTrustDangerousSnippet = function() {
    if ($scope.selection == 'Warning') {
      return $sce.trustAsHtml($scope.warnings[$scope.arrayPosition].description[0]);
    }
    else if ($scope.selection == 'Alert') {
      return $sce.trustAsHtml($scope.alerts[$scope.arrayPosition].description[0]);
    }
  };
  $scope.close = function() {
    $scope.country_card = false;
  }

})
