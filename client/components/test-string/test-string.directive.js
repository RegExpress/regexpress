(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('testString', testString);


  function testString() {
    return {
      restrict: "E",
      replace: true,
      template: '<button>test String click</button>',
      link: function(scope, element, attrs) {
        element.on('click', function(){
          console.log('checkshit')
          scope.checkShit();
        })

      }
    }
  }
})();