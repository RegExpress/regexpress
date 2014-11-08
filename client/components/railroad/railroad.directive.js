(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('placeRailroad', placeRailroad);


  // directive renders railroad html from railroad.html into the main index.html. No idea what "restrict: E" means.
  function placeRailroad() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: 'components/railroad/railroad.html',
      link: function(scope, element, attrs) {

      }
    }
  }
})();