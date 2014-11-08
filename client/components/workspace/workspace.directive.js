(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('placeWorkspace', placeWorkspace);


  function placeWorkspace() {
    return {
      restrict: "E",
      replace: false,
      template: '<div>This is where the workspace will be</div>',
      link: function(scope, element, attrs) {

      }
    }
  }
})();