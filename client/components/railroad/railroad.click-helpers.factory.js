(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){

      function checkLocation(event){
        var loc;
        try {
          console.log('event on', event.toElement)
          loc = $(event.toElement).closest('.railroad-diagram')[0];
          loc = loc.tagname;
        } catch (err) {
          loc = 'off';
        }
        return loc;
      }

      function checkUnder(event){
        $(event.target).hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $(event.target).show();
        console.log('class?', $(elem).attr('class'))
        return $(elem).attr('class');
      }


      return {
        checkLocation: checkLocation,
        checkUnder: checkUnder
      }
    }

})();