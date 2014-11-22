(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('testString', testString);


// we probably do not need this any more, here for posterity
  function testString() {
    return {
      restrict: "A",
      replace: true,
      link: function(scope, element, attrs) {
        scope.$on('matched changed', function(data){

          var wordMatches = scope.main.matches[0].split(' ')
          var test = ["llama", "boxes", "possums"]
          console.log(wordMatches, Array.isArray(wordMatches), test, Array.isArray(test));
          element.highlightTextarea({
            words: wordMatches
          })
          // $('.highlighter mark').css("background-color", "red")
        })
      }
    }
  }
})();
