(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', trackMatches);

  function trackMatches() {

    return {
      restrict: "E",
      template: '<div>matches</div>',
      link: function(scope, element, attrs) {
        // watches for changes in regex, creates matched string and appends to DOM
        scope.$watchGroup(['main.regexp', 'main.string'], function(newVal, oldVal){
          try {
            scope.main.matches = scope.main.string.match(scope.main.regexp);
            element.empty();
            element.append('<p>' + scope.main.matches + '</p>');

            var wordMatches = scope.main.matches[0];

            // console.log(wordMatches)
            $('#textarea').highlightTextarea({
              words: [wordMatches]
            })
          } catch (err) {
            console.log(err)
          }
        });
      }
    }
  }
})();
