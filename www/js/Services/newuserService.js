

angular.module('TerryServices').factory('NewUserService', function (Restangular, UserModel, DSCacheFactory, $q) {
    
    'use strict';
        // Create a new cache called "userCache"
        var userCache = DSCacheFactory('userCache', {
            maxAge: 3600000,
            deleteOnExpire: 'aggressive',
            storageMode: 'localStorage', // This cache will sync itself with `localStorage`.
            onExpire: function (key, value) {
                Restangular.oneUrl('users', key).get().then(function(data) {
                    userCache.put(key, data);
                });
            }
        });

        Restangular.extendModel('users', function(obj) {
            return UserModel.mixInto(obj);
        });

        Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if(operation === 'get') {
                debugger;
                //Check the cache to see if the resource is already cached
                var data = userCache.get(url);
                //If cache object does exist, return it
                if(data !== undefined) {
                    angular.extend(element, data);

                    var defer = $q.defer();
                    httpConfig.timeOut = defer.promise;
                    defer.resolve();
                }

                return {
                    element: element,
                    headers: headers,
                    params: params,
                    httpConfig: httpConfig
                };
            }
        });

        Restangular.addResponseInterceptor(function(data, operation, what, url, response) {
            //Cache the response from a get method
            if(operation === 'get') {
                debugger;
                userCache.put(url, data);
            }

            //Unvalidate the cache when a 'put', 'post' and 'delete' is performed to update the cached version.
            if (operation === 'put' || operation === 'post' || operation === 'delete') {
                userCache.destroy();
            }

            return response;
        });

        return Restangular.service('users');
}]);
