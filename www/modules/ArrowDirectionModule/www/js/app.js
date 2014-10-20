'use strict';

/* App Module */

var locationModule = angular.module('locationModule', [ 'ngRoute',
                                                        'locationControllerModule']);

locationModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/cp', {
        templateUrl: 'tpl/compassDisplay.html',
        controller: 'locationDisplayController'
      }).
      otherwise({
        redirectTo: '/cp'
      });
  }]);