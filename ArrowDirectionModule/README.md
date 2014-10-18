#ArrowDirectionModule
ArrowDirectionModule uses geolocation, compass and accelerometer phonegap/cordova plugins in Angularjs.

The module watches your current location, heading, and accelerometer values.
It can also save a position and then calculate the bearing and distance to the saved position from your current position. 

##Controller.js
All the working code is currently in controllers.js. It demos all the functionality of this module. 

##Services.js
I took the functions defined in the controller and structured them into a angular service. I recommend using this service to communicate with the cordova plugins as this service uses promises which is supposed to be better.

##How to use
First add the services.js into your project like so
```
<script src="../services.js"></script>
```

Then make sure to add to your app a dependency to the locationServicesModule.
```
angular.module('yourAppName', ['locationServicesModule']);
```
```
var locationServices = angular.module('locationServicesModule', []);
```

To use the service in a controller, inject the service name into the controller. The following example will use the ```'accelerometerServe'``` service.

```
.controller('controllerName', ['$scope','accelerometerServe',
  function($scope, accelerometerServe) 
  {...}]);
```

Within your controller you can call any function of the service using the ```.then()``` function of promises. 
```
accelerometerServe.getCurrentAcceleration().then(function(result) {
              //Success callback if the acceleration is given
              //result is the current acceleration
          }, function(err) {
              //Error callback if there is an error in getting the acceleration
          });
```
   
##Example
Look at the PublicArtApp for a sample implementation of this service.

https://github.com/DataAnalyticsinStudentHands/PublicArtApp
