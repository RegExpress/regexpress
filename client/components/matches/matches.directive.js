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
          var $textarea = $('.test-text');

          scope.$emit('matched changed');
          try {
            scope.main.matches = scope.main.string.match(scope.main.regexp);
            element.empty();
            // element.append('<p>' + scope.main.matches + '</p>');
            var wordMatches = scope.main.matches[0].split(' ')
            var test = ["word", "stuff", "w"]
            scope.$broadcast('matched changed');
            // console.log(scope.main.regexp)
            var regex = [];
            regex.push('"' + scope.main.regexp + '"')
            // console.log(regex)
            // $textarea.highlightTextarea({
            //   words: wordMatches
            // })
            // console.log(wordMatches);
          } catch (err) {
            // console.log(err)
          }
        });
      }
    }
  }
})();
