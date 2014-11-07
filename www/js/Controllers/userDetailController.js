/*global angular*/

/**
 * @ngdoc function
 * @name controller:UsersCtrl
 * @description
 * # UsersController
 * Controller for User objects
 */
angular.module('Controllers').controller('UserDetailCtrl', function ($scope, $stateParams, Restangular, user) {
    'use strict';

    var original = user;
    $scope.user = Restangular.copy(original);

});

