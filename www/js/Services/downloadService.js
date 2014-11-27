/*global angular, console, Blob, saveAs*/

/**
 * @ngdoc function
 * @name service:DownloadService
 * @description
 * # DownloadService
 * File download serviceService
 */
angular.module('Services').service('DownloadService', function Download($ionicLoading, Restangular, ngNotify) {
    'use strict';

    this.get = function (id, fileName, fileLabel) {
        $ionicLoading.show({template: '<div class="item item-icon-left"><i class="icon ion-loading-c"></i>Downloading PDF ...</div>'});
        return Restangular.all("applications")
            .withHttpConfig({responseType: 'arraybuffer'}).customGET("download", {applicationId: id, fileName: fileName })
            .then(
            function (success) {
                
                var blob = new Blob([success], {
                    type: "application/pdf"
                });
                //saveAs provided by FileSaver.js
                saveAs(blob, fileLabel + '.pdf');
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