/*global angular, cordova, console, StatusBar, window*/

angular.module('terry-management-app', [
    'ionic',
    'Controllers',
    'Services',
    'Directives',
    'Filters',
    'restangular',
    'ngNotify',
    'ui.bootstrap.datetimepicker',
    'databaseControllerModule',
    'databaseServicesModule'
]).run(function ($ionicPlatform, Restangular, $rootScope, Auth, $q, $state) {
    'use strict';

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    //Restangular.setBaseUrl("http://localhost:8080/terrytest/");
    Restangular.setBaseUrl("https://www.housuggest.org:8443/terrytest/");
    //Restangular.setBaseUrl("https://www.housuggest.org:8443/terry/");
    
    $rootScope.Restangular = function () {
        return Restangular;
    };
    
    $rootScope.isAuthenticated = function () {
        return Auth.hasCredentials();
    };

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log("$stateChangeStart");
        console.log($rootScope.isAuthenticated());
        if (toState.authenticate && !$rootScope.isAuthenticated()) {
            console.log("non-authed");
            // User isn’t authenticated
            $state.go("login");
            //What?
            event.preventDefault();
        } else {
            console.log("authed");
        }
    });

    //Logout user by clearing credentials
    $rootScope.logout = function () {
        Auth.clearCredentials();
        console.log("log out");
        $state.go('login', {}, {
            reload: true
        });
    };
})

    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'loginCtrl',
                authenticate: false
            })

            // secure abstract state
            .state('secure', {
                url: "/tab",
                abstract: true,
                authenticate: true,
                templateUrl: "templates/tabs.html"
            })

            .state('secure.dash', {
                url: '/dash/:appType',
                authenticate: true,
                resolve: {
                    items: function (DataService) {
                        return DataService.getAllItemsWithFileNames('application');
                    }
                },
                views: {
                    'secure-dash': {
                        templateUrl: 'templates/tab-freshman.html',
                        controller: 'FreshmanCtrl'
                    }
                }
            })
        
            .state('secure.transfer', {
                url: '/transfer/:appType',
                authenticate: true,
                resolve: {
                    items: function (DataService) {
                        return DataService.getAllItemsWithFileNames('transferApplication');
                    }
                },
                views: {
                    'secure-transfer': {
                        templateUrl: 'templates/tab-freshman.html',
                        controller: 'TransferCtrl'
                    }
                }
            })
        
            .state('secure.account', {
                url: '/account',
                views: {
                    'secure-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                },
                authenticate: true
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/login");

    });