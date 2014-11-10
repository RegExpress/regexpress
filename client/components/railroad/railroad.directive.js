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

        // takes railroad diagram and appends to DOM
        scope.displayRailroad = function(){
          var rr = scope.railroad;
          element.empty();
          element.append( '<div>'+rr+'</div>');
        }

      }
    }
  }
})();