/*global angular, console*/

/**
 * @ngdoc function
 * @name terry.service:DataService
 * @description
 * # DataService
 * Service for the terry
 */
angular.module('Services').factory('DataService', function (Restangular, $q, DSCacheFactory, ngNotify) {
    'use strict';

    return {
        
        getAllItems: function (acType) {

            return Restangular.all(acType).getList().then(
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
                    ngNotify.set("Succesfully deleted your " + type + " .", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to delete " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        }
    };
});