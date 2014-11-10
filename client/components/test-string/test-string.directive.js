(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('testString', testString);

// NOT BEING USED CURRENTLY
  function testString() {
    return {
      restrict: "E",
      replace: true,
      template: '<p></p>',
      link: function(scope, element, attrs) {

      }
    }
  }
})();