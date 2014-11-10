(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('placeRailroad', placeRailroad);


  // directive renders railroad html
  function placeRailroad() {
    return {
      restrict: "E",
      replace: true,
      template: '<div>.</div>',
      link: function(scope, element, attrs) {

        element.on('click', function(){
          var rr = scope.railroad;

          element.empty();
          element.append(''+rr)
        })

      }
    }
  }
})();