(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('aboutUs', aboutUs);


  function aboutUs() {
    return {
      restrict: "E",
      replace: false,
      templateUrl: 'components/workspace/workspace.template.html',
      link: function(scope, element, attrs) {

      }
    }
  }
})();