'use strict';
/* Controllers */
var databaseController = angular.module('databaseControllerModule', []);

databaseController.controller('loginCtrl', ['$scope', 'Auth', '$state',
 function($scope, Auth, $state) {
     if($scope.isAuthenticated() === true) {
         //Point 'em to logged in page of app
         $state.go('secure.dash');
     }
     
     //we need to put the salt on server + client side and it needs to be static
     $scope.salt = "nfp89gpe"; //PENDING
     
     $scope.model = {};
         
     $scope.submit = function() {
         if ($scope.model.userName && $scope.model.passWord) {
             $scope.passWordHashed = new String(CryptoJS.SHA512($scope.model.passWord + $scope.model.userName + $scope.salt));
             console.log($scope.passWordHashed.toString());
             Auth.setCredentials($scope.model.userName, $scope.passWordHashed);
             $scope.loginResultPromise = $scope.Restangular().all("users").all("myUser").getList();
             $scope.loginResultPromise.then(function(result) {
                $scope.loginResult = result;
                $scope.loginMsg = "You have logged in successfully! Status 200OK technomumbojumbo";
                Auth.confirmCredentials();
                $state.go('secure.dash');
             }, function(error) {
                $scope.loginMsg = "Arghhh, matey! Check your username or password.";
                Auth.clearCredentials();
             });
             $scope.model.userName = '';
             $scope.model.passWord = '';
         } else if(!$scope.model.userName && !$scope.model.passWord) {
             $scope.loginMsg = "You kiddin' me m8? No username or password?";
         } else if (!$scope.model.userName) {
             $scope.loginMsg = "No username? Tryina hack me?";
             $scope.loginResult = "";
         } else if (!$scope.model.passWord) {
             $scope.loginMsg = "What? No password!? Where do you think you're going?";
             $scope.loginResult = "";
         }
     };
 }]);

databaseController.controller('registerCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
    $scope.registerUser = function() {
        Auth.setCredentials("Visitor", "test");
        $scope.salt = "nfp89gpe";
        $scope.register.password = new String(CryptoJS.SHA512($scope.register.password + $scope.register.username + $scope.salt));
        $scope.$parent.Restangular().all("users").post($scope.register).then(
            function(success) {
                Auth.clearCredentials();
                console.log("USER CREATED");
                $state.go("login", {}, {reload: true});
            },function(fail) {
                Auth.clearCredentials();
                console.log("REGISTRATION FAILURE");
        });

        Auth.clearCredentials();
    }
}]);

databaseController.controller('secureCtrl', ['$scope', 'Auth', '$state',
  function($scope, Auth, $state) {
      //nothing to see here, move along
      $scope.logOut = function() {
          console.log('loggedout');
          Auth.clearCredentials();
          $state.go('secure',{},{reload: true});
      }
  }]);