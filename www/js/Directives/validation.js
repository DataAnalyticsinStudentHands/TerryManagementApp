/*global angular*/

/* Validation directives*/
angular.module('Directives')

.directive('onValidSubmit', function($parse, $timeout, ngNotify) {
    return {
      require: '^form',
      restrict: 'A',
      link: function(scope, element, attrs, form) {
        form.$submitted = false;
        var fn = $parse(attrs.onValidSubmit);
        element.on('submit', function(event) {
          scope.$apply(function() {
            element.addClass('ng-submitted');
            form.$submitted = true;
            if (form.$valid) {
              if (typeof fn === 'function') {
                fn(scope, {$event: event});
              }
            } else {
                ngNotify.set("Please check your input for missing values or wrong entries!", {
                position: 'bottom',
                type: 'error'
            });
            }
          });
        });
      }
    };
 
  })

  .directive('validated', function($parse) {
    return {
      restrict: 'AEC',
      require: '^form',
      link: function(scope, element, attrs, form) {
        var inputs = element.find("*");
        for(var i = 0; i < inputs.length; i++) {
          (function(input){
            var attributes = input.attributes;
            if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
              var field = form[attributes.name.value];
              if (field != void 0) {
                scope.$watch(function() {
                  return form.$submitted + "_" + field.$valid;
                }, function() {
                  if (form.$submitted !== true) return;
                  var inp = angular.element(input);
                  if (inp.hasClass('ng-invalid')) {
                    element.removeClass('has-success');
                    element.addClass('has-error');
                  } else {
                    element.removeClass('has-error').addClass('has-success');
                  }
                });
              }
            }
          })(inputs[i]);
        }
      }
    };
  });


