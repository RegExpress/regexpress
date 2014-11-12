(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', trackMatches);

  function trackMatches() {

    return {
      restrict: "E",
      template: '<div></div>',
      link: function(scope, element, attrs) {
        // watches for changes in regex, creates matched string and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal){
          try {
            scope.main.matches = scope.main.string.match(scope.main.regexp);
            element.empty();
            element.append('<p>' + scope.main.matches + '</p>');
          } catch (err) {
            // triggered when there are no matches
          }
        });
      }
    }
  }
})();