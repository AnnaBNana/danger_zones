danger_zone.controller('mapController', function($scope, $sce, $location, $window, $routeParams, mapFactory) {
  //scope variables declaration;
  $scope.warnings = [];
  $scope.country_names = [['Country', 'Alert Level']];
  $scope.alerts = [];
  $scope.selected_county = "";
  $scope.arrayPositon = 0;
  $scope.current_news = [];
  $scope.stories = [];
  $scope.story_display_count = 3;
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
              $scope.date = $scope.alerts[i].pubDate[0];
            }
          }

          for (var j = 0; j < $scope.warnings.length; j++) {
            if ($scope.warnings[j].title[0] == $scope.name) {
              $scope.selected_text = $scope.warnings[j].description[0];
              $scope.arrayPosition = j;
              $scope.selection = 'Warning';
              $scope.date = $scope.warnings[i].pubDate[0];
            }
          }

          $scope.selected_country = $scope.name;
          $scope.getNews($scope.selected_country, $scope.date);
          // console.log($scope.arrayPosition);
          $scope.country_card = true;
          $scope.about_DZ = false;
          // console.log($scope.country_card);
          $scope.$apply();
      }

      google.visualization.events.addListener(chart, 'select', myClickHandler);

      chart.draw(data, options);
      // console.log(data);
  }
  google.load('visualization', '1', {packages: ['geochart'], callback: drawRegionsMap});

  mapFactory.alerts_index(function(data) {
    // console.log(data[0].data[0].item);
    $scope.alerts = data[0].data[0].item;
    alertCountryNameConverter();
    // console.log('alerts', $scope.alerts);
  })

  mapFactory.warnings_index(function(data) {
    // console.log(data[0].data[0].item);
    $scope.warnings = data[0].data[0].item;
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
    $scope.about_DZ = false;
    $scope.story_display_count = 3;
    $scope.stories = [];
  }
  $scope.what = function() {
    $scope.about_DZ = true;
    console.log($scope.about_DZ);
    $scope.country_card = false;
  }
  $scope.getNews = function(country, date) {
    console.log(country, date);
    $scope.country_info = {country: country, date: date};
    mapFactory.getNews($scope.country_info, function(data) {
      $scope.current_news = data;
      // console.log($scope.current_news.response.docs);
      for (x in $scope.current_news.response.docs) {
        var headline = $scope.current_news.response.docs[x].headline.main;
        var url = $scope.current_news.response.docs[x].web_url;
        $scope.stories.push({headline: headline, url: url});
      }
      console.log($scope.stories);
    })
  }
  $scope.expandStoryList = function() {
    $scope.story_display_count += 3;
  }
  $scope.terrorFilter = function() {
    $scope.country_names = [['Country', 'Alert Level']];
    for(x in $scope.alerts) {
      var y = $scope.alerts[x].description[0].search("terrorist");
      if (y > 0) {
        $scope.country_names.push([$scope.alerts[x].title[0], 400]);
      }
    }
    for(a in $scope.warnings) {
      var b = $scope.warnings[a].description[0].search("terrorist");
      if (b > 0) {
        $scope.country_names.push([$scope.warnings[a].title[0], 800]);
      }
    }
    drawRegionsMap();
    console.log($scope.warnings);
  }
  $scope.disasterFilter = function() {
    $scope.country_names = [['Country', 'Alert Level']];
    for(x in $scope.alerts) {
      var y = $scope.alerts[x].description[0].search("weather");
      if (y > 0) {
        $scope.country_names.push([$scope.alerts[x].title[0], 400]);
      }
    }
    for(a in $scope.alerts) {
      var b = $scope.alerts[a].description[0].search("earthquakes");
      if (b > 0) {
        $scope.country_names.push([$scope.alerts[a].title[0], 400]);
      }
    }
    for(c in $scope.warnings) {
      var d = $scope.warnings[c].description[0].search("weather");
      if (d > 0) {
        $scope.country_names.push([$scope.warnings[c].title[0], 800]);
      }
    }
    for(e in $scope.warnings) {
      var f = $scope.warnings[e].description[0].search("earthquakes");
      if (f > 0) {
        $scope.country_names.push([$scope.warnings[e].title[0], 800]);
      }
    }
    drawRegionsMap();
    console.log($scope.warnings);
  }
  $scope.kidnappingFilter = function() {
    $scope.country_names = [['Country', 'Alert Level']];
    for(x in $scope.alerts) {
      var y = $scope.alerts[x].description[0].search("kidnapping");
      if (y > 0) {
        $scope.country_names.push([$scope.alerts[x].title[0], 400]);
      }
    }
    for(a in $scope.warnings) {
      var b = $scope.warnings[a].description[0].search("kidnapping");
      if (b > 0) {
        $scope.country_names.push([$scope.warnings[a].title[0], 800]);
      }
    }
    drawRegionsMap();
    console.log($scope.warnings);
  }
  $scope.clearFilters = function() {
    console.log('yes');
    $window.location.reload();
  }

})
