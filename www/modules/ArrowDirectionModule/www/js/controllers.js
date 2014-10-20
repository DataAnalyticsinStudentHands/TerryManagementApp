'use strict';
/* Controllers*/

var locController = angular.module('locationControllerModule',[]);
locController.controller('locationDisplayController', ['$scope',
    function($scope) {
        var currHead = null;
        var currLat = null;
        var currLon = null;
        var testLat = null;
        var testLon = null;
        var watchID = null;
        var geoWatchID = null;
        var accWatchID = null;
        var bearing = null;
        
        // Wait for device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, false);

        
        // device APIs are available
        function onDeviceReady() {
            $scope.startWatch();
            $scope.startGeoWatch();
            $scope.startAccWatch();
        }

        //COMPASS
        // Start watching the compass
        $scope.startWatch = function startWatch() {

            // Update compass every .1 seconds
            var options = { frequency: 100 };

            watchID = navigator.compass.watchHeading(onSuccess, onError, options);
            
            var element = document.getElementById('debug');
            element.innerHTML = 'compass started';
        };

        // Stop watching the compass
        $scope.stopWatch = function() {
            if (watchID != null) {
                navigator.compass.clearWatch(watchID);
                watchID = null;
                
                var element = document.getElementById('debug');
                element.innerHTML = 'compass stopped';
            }
        };

        // onSuccess: Get the current heading
        //heading: magneticHeading, timestamp
        function onSuccess(heading) {
            currHead=heading.magneticHeading;
            var element = document.getElementById('heading');
            element.innerHTML = 'Heading: ' + heading.magneticHeading+'<br>'+
                                'Direction: '+(bearing-currHead);
        }

        // onError: Failed to get the heading
        function onError(compassError) {
            alert('Compass error: ' + compassError.code);
        }
        
        
        //GEOLOCATIONS
        //Start watching location
        $scope.startGeoWatch = function () {
            
            var geoOptions = { timeout: 30000, enableHighAccuracy: true};
            
            geoWatchID = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, geoOptions);
            
            var element = document.getElementById('debugG');
            element.innerHTML = 'geo started';
        };

        //Stop watching location
        $scope.stopGeoWatch = function () {
            if (geoWatchID!=null) {
                navigator.geolocation.clearWatch(geoWatchID);
                geoWatchID = null;
                var element = document.getElementById('debugG');
                element.innerHTML = 'geo stopped';
            }
        };
        
        var num = 0;
        // onSuccess: Geolocation
        // position: coords: (lat, long, altitude, accuracy, heading, speed), timestamp
        function onGeoSuccess(position) {
            
            currLat = position.coords.latitude;
            currLon = position.coords.longitude;
            $scope.calcDistance();
            num++;
            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                                'Longitude: ' + position.coords.longitude     + '<br />' +
                                'count: '+num;
    
            
        }

        // onError Callback receives a PositionError object
        function onGeoError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
        
        
        //ACCELEROMETER
        //Start watching accelorometer
        $scope.startAccWatch = function (){
            var accOptions = {frequency: 1000};
            accWatchID = navigator.accelerometer.watchAcceleration(onAccSuccess, onAccError, accOptions);
            
            var element = document.getElementById('debugA');
            element.innerHTML = 'acc start';
        };
        
        $scope.stopAccWatch = function (){
            if (accWatchID!=null){
                navigator.accelerometer.clearWatch(accWatchID);
                accWatchID = null;
                var element = document.getElementById('debugA');
                element.innerHTML = 'acc stopped';
            }
        }
        
        function onAccSuccess(acceleration) {
            var element = document.getElementById('acceleration');
            element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br>' +
              'Acceleration Y: ' + acceleration.y + '<br>' +
              'Acceleration Z: ' + acceleration.z + '<br>' +
              'Timestamp: '      + acceleration.timestamp + '<br>';
        }

        // onError Callback receives a PositionError object
        function onAccError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
        
        
        $scope.stopAll = function (){
            $scope.stopWatch();
            $scope.stopGeoWatch();
            $scope.stopAccWatch();

        };
        
        $scope.savePos = function() {
            testLat = currLat;
            testLon = currLon;
            var element = document.getElementById('position');
            element.innerHTML = 'Latitude: '  + testLat      + '<br />' +
                                'Longitude: ' + testLon     + '<br />';
        
        };
        
        $scope.calcDistance = function (){
            
            if (testLat!=null){
                
                var lat1 = currLat;
                var lon1 = currLon;
                var lat2 = testLat;
                var lon2 = testLon;

                    var R = 20902230.97;
                    var rLat1 = lat1* Math.PI / 180;
                    var rLat2 = lat2* Math.PI / 180;
                    var rLon1 = lon1* Math.PI / 180;
                    var rLon2 = lon2* Math.PI / 180;
                    var dLat = (lat2-lat1)* Math.PI / 180;
                    var dLon = (lon2-lon1)* Math.PI / 180;

                    //haversine
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(rLat1) * Math.cos(rLat2) *
                            Math.sin(dLon/2) * Math.sin(dLon/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d1 = R * c;

                    //spherical law of cosine
                    var d2 = Math.acos( Math.sin(rLat1)*Math.sin(rLat2) + Math.cos(rLat1)*Math.cos(rLat2) * Math.cos(dLon) ) * R;

                    //equirectangular
                    var x = (rLon2-rLon1) * Math.cos((rLat1+rLat2)/2);
                    var y = (rLat2-rLat1);
                    var d3 = Math.sqrt(x*x + y*y) * R;
                
                    //Bearing 
                    var y = Math.sin(dLon) * Math.cos(lat2);
                    var x = Math.cos(lat1)*Math.sin(lat2) -Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
                    var brng = Math.atan2(y, x)* 180 / Math.PI;
                    bearing = (brng+360) % 360;
    
                
                var element = document.getElementById('distance');
                element.innerHTML = 'Haversin: '+ d1 +'<br>'+
                                    'Law Cosines: '+ d2+'<br>'+
                                    'EquiRectangular: '+ d3+'<br>'+
                                    'Bearing: '+ bearing+'<br>';
            }else{
                var element = document.getElementById('distance');
                element.innerHTML = 'No saved position to measure distance from!';
            }
        };
        
        
 }]);