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
            var stuff = scope.main.string.match(scope.main.regexp);
            element.empty();
            element.append('<p>' + scope.main.matches + '</p>');
            // console.log(stuff, "stuff")
            var wordMatches = stuff[0].split(' ')

            console.log(wordMatches)
            $('#textarea').highlightTextarea({
              words: wordMatches
            })
          } catch (err) {
            console.log(err)
          }
        });
      }
    }
  }
})();
