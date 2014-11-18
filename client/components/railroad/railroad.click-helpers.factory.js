(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){

      function checkUnder(event){
        $(event.target).hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $(event.target).show();
        return $(elem).attr('class');
      }

      return {
        checkUnder: checkUnder
      }
    }

})();