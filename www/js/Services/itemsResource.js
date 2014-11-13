/*global angular, console*/

/**
 * @ngdoc function
 * @name terry.service:DataService
 * @description
 * # DataService
 * Service for the terry
 */
angular.module('Services').factory('itemsResource', function($resource) {
       return $resource('/dash/:itemId', {itemId: '@id'});
    });