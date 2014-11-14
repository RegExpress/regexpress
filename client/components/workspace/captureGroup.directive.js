(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('captureGroupTemplate', function() {
      return {
        restrict: "E",
        replace: false,
        templateUrl: 'components/workspace/element_library/template-captureGroup.html',
        link: function(scope, element, attrs) {

        }
      }
    });
})();