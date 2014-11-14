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
          console.log("parsing regex");
          scope.main.regexTree = parseRegex(scope.main.regexp);
          var newRR = scope.rr.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR+'</div>');
        });

        element.on('click', function(event){
          console.log('closest element of class .RR',$(element).closest('.RR'))

        });
      }
    }
  }
})();
