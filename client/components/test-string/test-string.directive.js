(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('testString', testString);


// literally fuck this
  function testString() {
    return {
      restrict: "E",
      replace: true,
      template: '<div>HEY NOW<div>ok</div></div>',
      link: function(scope, element, attrs) {
        element.on('click', function(event){
          
        });
      }
    }
  }
})();