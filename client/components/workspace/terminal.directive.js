(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('terminalTemplate', function() {
      return {
        restrict: "E",
        replace: false,
        template: '<div>This is the terminal template</div>',
        link: function(scope, element, attrs) {

        }
      }
    });
})();