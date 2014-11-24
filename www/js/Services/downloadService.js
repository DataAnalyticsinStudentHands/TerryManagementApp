/*global angular, console, Blob, saveAs*/

angular.module('Services').service('DownloadService', function Download($ionicLoading, Restangular, ngNotify) {
    'use strict';
    
    

    this.get = function (id, fileName) {
        $ionicLoading.show({
            template: 'Downloading pdf ...'
        });
        return Restangular.all("applications")
            .withHttpConfig({responseType: 'arraybuffer'}).customGET("download", {applicationId: id, fileName: fileName })
            .then(
            function (success) {
                
                var blob = new Blob([success], {
                    type: "application/pdf"
                });
                //saveAs provided by FileSaver.js
                saveAs(blob, fileName);
                $ionicLoading.hide();
            },
                function (error) {
                    $ionicLoading.hide();
                    ngNotify.set("Something went wrong while getting the essay file !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
        );
    };
});