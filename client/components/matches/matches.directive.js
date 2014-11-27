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
          var highlight = function(words) {

          }

          scope.$emit('matched changed');
          try {
            scope.main.matches = scope.main.string.match(scope.main.regexp);
            element.empty();
            // element.append('<p>' + scope.main.matches + '</p>');
            var wordMatches = [];

            for(var i = 0; i < scope.main.matches[0].split(' ').length; i++) {
              wordMatches.push(scope.main.matches[0].split(' ')[i])
            }
            // var inputValue = [];
            // inputValue.push($textarea.val())

            console.log(wordMatches)
            $textarea.highlightTextarea({
              color: "#96BD4F",
              words: wordMatches
            })

          } catch (err) {
            // console.log(err)
          }
        });
      }
    }
  }
})();
