(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', railroad);

  function railroad() {

    return {
      restrict: "E",
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attrs) {

        // makes railroad diagram and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          var newRR = scope.rr.createRailroad(scope.main.regexp);
          element.empty();
          element.append( '<div>'+ newRR+'</div>');
        })
      }
    }
  }
})();