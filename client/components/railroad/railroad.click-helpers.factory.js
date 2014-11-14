(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){

      function checkLocation(event){
        var loc;
        try {
          loc = $(event.toElement).closest('.railroad-diagram')[0].tagName || undefined;
        } catch (err) {
          loc = 'off';
        }
        return loc;
      }

      return {
        checkLocation: checkLocation
      }
    }

})();