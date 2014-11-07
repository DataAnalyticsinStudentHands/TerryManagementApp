/*global angular, console */

/**
 * @ngdoc function
 * @name controller:DashCtrl
 * @description
 * # DashController
 * Controller for objects used in the dashboard
 */
angular.module('Controllers').controller('DashCtrl', function ($scope, $filter, $ionicModal, $ionicPopup, DataService) {
    'use strict';

    $scope.myVariables = {
        current_mode: 'Add'
    };
    
    $scope.locations = {};
    $scope.location = {};
    $scope.classes = {};
    $scope.aclass = {};

    // GET 
    DataService.getAllItems('locations').then(
        function (result) {
            $scope.locations = result;
        }
    );

    // GET 
    DataService.getAllItems('classes').then(
        function (result) {
            $scope.classes = result;
        }
    );
    
    // callback for ng-click 'showAddModal':
    $scope.showAddModal = function (acType) {

        $scope.myVariables.current_mode = "Add";
        $scope.location = {};
        $scope.aclass = {};

        $ionicModal.fromTemplateUrl('templates/modals/modal_' + acType + '.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };
    
    
    // callback for ng-click 'saveModal':
    $scope.saveModal = function (acType) {

        switch (acType) {
        case 'locations':
            if ($scope.myVariables.current_mode === 'Add') {
                DataService.addItem(acType, $scope.location).then(
                    function (success) {
                        $scope.updateList(acType);
                        $scope.modal.hide();
                    }
                );
            } else {
                DataService.updateItem(acType, $scope.location.id, $scope.location).then(
                    function (success) {
                        $scope.modal.hide();
                    }
                );
            }
            break;
        case 'classes':
            if ($scope.myVariables.current_mode === 'Add') {
                DataService.addItem(acType, $scope.aclass).then(
                    function (success) {
                        $scope.updateList(acType);
                        $scope.modal.hide();
                    }
                );
            } else {
                DataService.updateItem(acType, $scope.aclass.id, $scope.aclass).then(
                    function (success) {
                        $scope.modal.hide();
                    }
                );
            }
            break;
        }
    };
    
    // callback for ng-click 'editData'
    $scope.editData = function (acType, item) {
        $scope.myVariables.current_mode = "Edit";
        
        $scope.location = item;
        $scope.aclass = item;

        $ionicModal.fromTemplateUrl('templates/modals/modal_' + acType + '.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };
    
    // callback for ng-click 'deleteData':
    $scope.deleteData = function (acType, item_id) {

        $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete your ' + acType + ' item from the list?'
        }).then(function (res) {
            if (res) {
                DataService.deleteItem(acType, item_id).then(
                    function (success) {
                        $scope.updateList(acType);
                    }
                );
            }
        });
    };

    $scope.updateList = function (acType) {
        switch (acType) {
        case 'locations':
            // GET 
            DataService.getAllItems(acType).then(
                function (result) {
                    $scope.locations = result;
                }
            );
            break;
        case 'classes':
            // GET 
            DataService.getAllItems(acType).then(
                function (result) {
                    $scope.classes = result;
                }
            );
            break;
        }
    };
    
    $scope.openDatePicker = function (title, acType) {
        $scope.tmp = {};

        var datePopup = $ionicPopup.show({
            template: '<datetimepicker data-ng-model="tmp.newDate" data-datetimepicker-config="{ startView:\'year\', minView:\'day\' }"></datetimepicker>',
            title: title,
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        var test = $filter('date')($scope.tmp.newDate, 'MM/dd/yyyy');
                        $scope.aclass[acType] = test;
                    }
                }
            ]
        });
    };
});