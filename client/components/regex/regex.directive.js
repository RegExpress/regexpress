(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackRegex', trackRegex);

  // watches changing user regex input and changes scope variable regexp to reflect this
  function trackRegex() {

    return {
      restrict: "E",
      template: '<div>regex directive</div>',
      link: function(scope, element, attrs) {

        scope.$watchGroup(['main.regexBody', 'main.regexTags'], function(newValues, oldValues){
          try {
            scope.main.regexp = new RegExp(newValues[0], newValues[1]);
            element.empty();
          } catch (err) {
          }
        });
      }
    };
  }

})();
