/*global angular*/

/**
 * @ngdoc function
 * @name controller:UsersCtrl
 * @description
 * # UsersController
 * Controller for User objects
 */
angular.module('Controllers', [])
    .controller('DashCtrl', function ($scope) {
        'use strict';
    })

    .controller('UsersCtrl', function ($scope, $location, $ionicModal, Restangular) {
        'use strict';

        $scope.myVariables = {};
        $scope.data = {};

        $scope.data.users = Restangular.all('users').getList().$object;

        // callback for ng-click 'deleteUser':
        $scope.deleteUser = function (userId) {
            Restangular.all('users').all(userId).remove().then(
                function (result) {
                    
                },
                function (resultFail) {
                    
                }
            );
        };

        // callback for ng-click 'modal'- open Modal dialog to
        // create new User
        $ionicModal.fromTemplateUrl('templates/modals/modal_user.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            $scope.Restangular().all('users').getList().then(
                function (result) {
                    $scope.users = result;
                },
                function (resultFail) {
                    // console.log(resultFail);
                }
            );
        });
    })

    .controller('UserDetailCtrl', function ($scope, $stateParams, Restangular) {
        'use strict';

        Restangular.one('users', $stateParams.userId).get().then(function (result) {
            $scope.user = result;
        });

    })

    .controller('AccountCtrl', function ($scope) {
        'use strict';
    });