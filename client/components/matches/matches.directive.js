(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', trackMatches);

  function trackMatches() {
    // currently useless!
    return {
      restrict: "E",
      template: '<div>matches</div>',
      link: function(scope, element, attrs) {
        // watches for changes in regex, creates matched string and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal){
          try {

            scope.main.matches = scope.main.string.match(scope.main.regexp);
            var stuff = scope.main.string.match(scope.main.regexp);
            element.empty();
            element.append('<p>' + stuff + '</p>');

          } catch (err) {
            // triggered when there are no matches
          }



        });
      }
    }
  }
})();