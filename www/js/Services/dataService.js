/*global angular, console*/

/**
 * @ngdoc function
 * @name terry.service:DataService
 * @description
 * # DataService
 * Service for the terry
 */
angular.module('Services').factory('DataService', function ($http, $ionicLoading, Restangular, ngNotify) {
    'use strict';

    //Load data for form data for terry application
    var application_form;

    $http.get('json/form_application.json').success(function (data) {
        application_form = data;
    });

    return {
        getApplicationForm: function () {
            return application_form;
        },
        addItem: function (type, item) {

            return Restangular.all(type).post(item).then(

                function (result) {
                    ngNotify.set("Succesfully saved your " + type + " to the server.", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to add " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        },
        getAllItems: function (acType) {
            $ionicLoading.show();
            return Restangular.all(acType).getList().then(
                function (result) {
                    $ionicLoading.hide();
                    result = Restangular.stripRestangular(result);
                    result.type = acType;
                    return result;
                },
                function (error) {
                    $ionicLoading.hide();
                    ngNotify.set("Something went wrong retrieving data for " + acType, {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );

        },
        getItem: function (acType, id) {

            return Restangular.one(acType, id).get().then(
                function (result) {
                    result = Restangular.stripRestangular(result);
                    result.type = acType;
                    return result;
                },
                function (error) {
                    ngNotify.set("Something went wrong retrieving data for " + acType, {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );

        },
        getItemList: function (acType, id) {
            $ionicLoading.show();
            return Restangular.one(acType).one('list').getList(id).then(
                function (result) {
                    $ionicLoading.hide();
                    result = Restangular.stripRestangular(result);
                    return result;
                },
                function (error) {
                    $ionicLoading.hide();
                    ngNotify.set("Something went wrong retrieving data for " + acType, {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            ).$object;
        },
        updateItem: function (type, item_id, item) {

            return Restangular.all(type).all(item_id).post(item).then(
                function (result) {
                    ngNotify.set("Succesfully updated your " + type + " on the server.", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to update " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        },
        deleteItem: function (type, item_id) {

            return Restangular.all(type).all(item_id).remove().then(
                function (result) {
                    ngNotify.set("Succesfully deleted your from " + type + " .", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to delete from " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        },
        getAllItemsWithFileNames: function (type) {
            $ionicLoading.show();
            return Restangular.one(type).one("withfilenames").get().then(
                function (success) {
                    $ionicLoading.hide();
                    success = Restangular.stripRestangular(success);
                /*$scope.myVariables.orig_fileEssay1 = $filter('filter')(result.fileName, 'essay1');
                if ($scope.myVariables.orig_fileEssay1.length !== 0) {
                    $scope.myVariables.fileEssay1 = $scope.myVariables.orig_fileEssay1[0].substr(6);
                }
                $scope.myVariables.orig_fileEssay2 = $filter('filter')(result.fileName, 'essay2', 'true');
                if ($scope.myVariables.orig_fileEssay2.length !== 0) {
                    $scope.myVariables.fileEssay2 = $scope.myVariables.orig_fileEssay2[0].substr(6);
                }*/
                    return success;
                },
                function (error) {
                    $ionicLoading.hide();
                    ngNotify.set("Something went wrong retrieving list of files for all " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        
        }
    };
    
});