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

        function toggleHeight(module){
          var hiddenHeight = 0;
          var shownHeight = 500;

          if ($(module).css('height') === shownHeight + 'px') {
            $(module).animate({height: hiddenHeight});
          } else {
            $(module).animate({height: shownHeight});
          }
        }

        $('.aboutUs').on('click', function(){
          toggleHeight('#aboutUsHidden');
        })

        $('.howDoesItWork').on('click', function(){
          toggleHeight('#howDoesItHidden');
        })
      }
    }
  }
})();
