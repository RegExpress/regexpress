(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('information', information);


  function information() {
    return {
      restrict: "E",
      replace: false,
      template: '<div></div>',
      link: function(scope, element, attrs) {

        var currentWidth;

        function toggleIt(module, attribute, expanded, collapsed){
          var obj = {};
          if ($(module).css(attribute) === expanded + 'px') {
            obj[attribute] = collapsed;
          } else {
            obj[attribute] = expanded;
          }
          $(module).animate(obj, {queue: false});
        }

        $('#aboutClick').on('click', function(){
          toggleIt('#aboutUsHidden', 'height', 500, 0);
        })

        $('#howClick').on('click', function(){
          toggleIt('#howDoesItHidden', 'height', 600, 0);
          if (!currentWidth) {
            currentWidth = parseInt($('#howDoesItHidden').css('width').slice(0,-2));
          }
          toggleIt('#howClick', 'width', 450, currentWidth);
          toggleIt('#howDoesItHidden', 'width', 450, currentWidth);
          $('#explanation').show();

        })
      }
    }
  }
})();
