(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('regexRunner', regexRunner);


  function regexRunner() {


    return {
      restrict: "E",
      replace: true,
      template: '<button>click me</button>',
      link: function(scope, element, attrs) {
        // element.on('click', matchString)
        // element.on('click', displayRailroad)

        // function displayRailroad(){
        //   scope.fuckshitup();
        // }

      }
    }
  }

})();