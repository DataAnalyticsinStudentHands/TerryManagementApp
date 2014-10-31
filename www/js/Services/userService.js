/*global angular*/

/**
 * @ngdoc function
 * @name service:UserService
 * @description
 * # UserService
 * Service
 */
angular.module('Services').factory('UserService', function (Restangular, $q, $filter, ngNotify) {
    'use strict';

    var allUsers,
        promAllUsers,
        myUser,
        updating;
    return {
        updateUsers:
            //ACCESSES SERVER AND UPDATES THE LIST OF USERS
            function (update) {
                if (update || (!allUsers && !updating)) {
                    promAllUsers = Restangular.all("users").getList();
                    updating = true;
                    promAllUsers.then(function (success) {
                        updating = false;
                        success = Restangular.stripRestangular(success);
                        allUsers = success;
                    }, function (fail) {
                        
                    });
                    return promAllUsers;
                } else if (updating) {
                    return promAllUsers;
                } else {
                    var defer = $q.defer();
                    defer.resolve("DONE");
                    return defer.promise;
                }
            },
        getAllUsers:
            function () {
                return this.updateUsers().then(function (success) {
                    return allUsers;
                });
            },
        getMyUser:
            function () {
                return Restangular.all("users").all("myUser").getList();
            },
        getUser:
            function (user_id) {
                return this.updateUsers().then(function (success) {
                    return $filter('getById')(allUsers, user_id);
                });
            },
        getMyRole:
            function () {
                return Restangular.all("users").all("myRole").getList().then(function (success) { return success[0]; });
            },
        addUser:
            function (user) {
                return Restangular.all("users").post(user).then(
                    function (result) {
                    ngNotify.set("Succesfully created user.", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not create user!", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
                );
            },
        editUser:
            function (id, user) {
                return Restangular.all("users").all(id).post(user);
            },
        deleteUser:
            function (userId) {
                Restangular.all('users').all(userId).remove().then(
                function (result) {
                    ngNotify.set("Succesfully deleted user.", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not delete user!", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
            }
    };
});