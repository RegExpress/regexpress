(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){

      function checkUnder(event){
        $('.copy').hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $('.copy').show();
        return $(elem).attr('class');
      }

      return {
        checkUnder: checkUnder
      }
    }

})();