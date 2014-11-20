/*global angular, console*/

angular.module('Services').service('DownloadService', function Download(Restangular) {
    'use strict';

    this.get = function (id) {
        return Restangular.one('applications/uploads', id)
            .withHttpConfig({responseType: 'arraybuffer'}).get().then(function (data) {
                console.log(data);
                var blob = new Blob([data], {
                    type: "application/pdf"
                });
          //saveAs provided by FileSaver.js
          saveAs(blob, id + '.pdf');
        })
      }
});