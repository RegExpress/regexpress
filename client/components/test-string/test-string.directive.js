(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('TestString', TestString);


  function TestString($scope) {
    return {};
  }
})();