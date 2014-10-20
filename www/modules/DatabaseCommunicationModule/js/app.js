'use strict';

/* App Module */

var databaseModule = angular.module('databaseModule', ['restangular', 'ngRoute', 'ngCookies', 'databaseControllerModule', 'databaseServicesModule',  'ui.router']);

databaseModule.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider.
      state('loggedout', {
        abstract: true,
        template: "<ui-view>"
      }).
      state('login', {
          url: "/login",
          templateUrl: "partials/login.html",
          controller: 'loginCtrl',
          authenticate: false
      });

    $stateProvider.
      state('loggedin', {
          abstract: true,
          template: "<ui-view>"
      }).
      state('secure', {
          url: "/secure",
          templateUrl: "partials/secure.html",
          controller: 'secureCtrl',
          authenticate: true
      });
  });

databaseModule.run(['Restangular', '$rootScope', 'Auth', '$q', '$state', function(Restangular, $rootScope, Auth, $q, $state) {
    Restangular.setBaseUrl("http://localhost:8080/RESTFUL-WS/services/");
    $rootScope.Restangular = function() {
        return Restangular;
    }
    $rootScope.addAuth = function() {
        //
    }
    $rootScope.isAuthenticated = function() {
        //BELOW - Trying to get promises to work to verify auth
//        var deferred = $q.defer();
//        //This should be set to a work-all URL.
//        var rqPromise = Restangular.all("users").get("2").then(function(result) {
//            console.log("authed");
//            return true;
//        }, function(error) {
//            Auth.clearCredentials();
//            console.log("not-authed");
//            return false;
//        });
//        return deferred.resolve(rqPromise);
        //END
        return Auth.hasCredentials();
    }
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      console.log("$stateChangeStart");
      console.log($rootScope.isAuthenticated());
      if (toState.authenticate && !$rootScope.isAuthenticated()){
        console.log("non-authed");
        // User isn’t authenticated
        $state.go("login");
        //What?
        event.preventDefault(); 
      } else console.log("authed");
    });
}]);