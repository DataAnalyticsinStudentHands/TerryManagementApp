/*global angular*/

/**
 * @ngdoc function
 * @name controller:UsersCtrl
 * @description
 * # UsersController
 * Controller for User objects
 */
angular.module('Controllers').controller('UsersCtrl', function ($scope, $location, $ionicModal, Restangular, UserService) {
    'use strict';

    $scope.myVariables = {};
    $scope.data = {};
    $scope.user = {};

    $scope.data.users = Restangular.all('users').getList().$object;

    // callback for ng-click 'deleteUser':
    $scope.deleteUser = function (userId) {
        UserService.deleteUser(userId);
        $scope.data.users = Restangular.all('users').getList().$object;
    };

    // callback for ng-click 'showAddModal':
    $scope.showAddModal = function (acType) {

        $scope.myVariables.current_mode = "Add";

        $ionicModal.fromTemplateUrl('templates/modals/modal_' + acType + '.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    // callback for ng-click 'saveModal':
    $scope.saveModal = function () {
        $scope.user.username = $scope.user.email;
        UserService.addUser($scope.user).then(
            function (success) {
                $scope.modal.hide();
            }
        );
    };
});