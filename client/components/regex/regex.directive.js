(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('regexRunner', regexRunner);


  function regexRunner() {
    function testRegex(){
      console.log($scope.string.match($scope.regex));
    }

    return {
      restrict: "E",
      replace: true,
      template: '<button>click me</button>',
      link: function(scope, element, attrs) {
        element.on('click', function($scope){
          scope.$apply(function(scope){
            // convert regexString to real regex
            var re = new RegExp(scope.regexBody, scope.regexTags);
            scope.match = scope.string.match(re);
        });
        })
      }
    }
  }

})();