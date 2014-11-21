/*global angular, console, Blob, saveAs*/

angular.module('Services').service('DownloadService', function Download($ionicLoading, Restangular) {
    'use strict';

    this.get = function (id, fileName) {
        $ionicLoading.show();
        return Restangular.all("applications")
            .withHttpConfig({responseType: 'arraybuffer'}).customGET("download", {applicationId: id, fileName: fileName })
            .then(function (data) {
                
                var blob = new Blob([data], {
                    type: "application/pdf"
                });
                //saveAs provided by FileSaver.js
                saveAs(blob, fileName);
                $ionicLoading.hide();
            });
    };
});