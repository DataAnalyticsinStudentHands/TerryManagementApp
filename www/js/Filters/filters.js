/*global angular, console*/

/* Filters */
angular.module('Filters', []);
  
angular.module('Filters').filter('interpolate', function(version) {
    'use strict';
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  });
 
/**
 * Truncate Filter
 * @Param string
 * @Param int, default = 0
 * @return string
 */
angular.module('Filters').filter('truncate', function () {
    'use strict';
        return function (text, start) {
            if (text === undefined)
                return null;
            if (isNaN(start))
                start = 0;
            
            if (text.length <= start) {
                return text;
            }
            else {
                return String(text).substring(start);
            }
 
        };
    });
 