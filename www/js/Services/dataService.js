/*global angular, console*/

/**
 * @ngdoc function
 * @name terry.service:DataService
 * @description
 * # DataService
 * Service for the terry
 */
angular.module('Services').factory('DataService', function ($http, $stateParams, $ionicLoading, Restangular, ngNotify) {
    'use strict';

    //Load data for form data for terry application
    var application_form,
        modal_award_form,
        modal_child_form,
        modal_coursework_form,
        modal_employment_form,
        modal_scholarship_form,
        modal_volunteer_form;

    $http.get('json/form_application.json').success(function (data) {
        application_form = data;
    });
    $http.get('json/form_modal_award.json').success(function (data) {
        modal_award_form = data;
    });
    $http.get('json/form_modal_child.json').success(function (data) {
        modal_child_form = data;
    });
    $http.get('json/form_modal_coursework.json').success(function (data) {
        modal_coursework_form = data;
    });
    $http.get('json/form_modal_employment.json').success(function (data) {
        modal_employment_form = data;
    });
    $http.get('json/form_modal_scholarship.json').success(function (data) {
        modal_scholarship_form = data;
    });
    $http.get('json/form_modal_volunteer.json').success(function (data) {
        modal_volunteer_form = data;
    });

    return {
        getApplicationForm: function (acType) {
            switch (acType) {
            case 'application':
                return application_form;
            case 'award':
                return modal_award_form;
            case 'child':
                return modal_child_form;
            case 'coursework':
                return modal_coursework_form;
            case 'employment':
                return modal_employment_form;
            case 'scholarship':
                return modal_scholarship_form;
            case 'volunteer':
                return modal_volunteer_form;
            }
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
            
            //return Restangular.one(acType).one('list').getList(id)
            return Restangular.one(acType).one('list').customGETLIST(id, {transfer: "false"}).then(
                function (result) {
                    
                    result = Restangular.stripRestangular(result);
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
            $ionicLoading.show({template: '<div class="item item-icon-left"><i class="icon ion-loading-c"></i>Loading Applications ...</div>'});
            var storedData = null;
            storedData = localStorage.getItem(type);
            if (storedData !== null) {
                storedData = JSON.parse(localStorage[type]);
                $ionicLoading.hide();
                return storedData;
            } else {
                return Restangular.one(type).one("withfilenames").get().then(
                    function (success) {
                        $ionicLoading.hide();
                        success = Restangular.stripRestangular(success);
                        localStorage[type] = JSON.stringify(success);
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
        }
    };
    
});