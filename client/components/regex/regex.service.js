(function() {
  'use strict';

  angular.module('makeRailroad', [])
    .factory('createRailroad', createRailroad);

    function createRailroad(){
      // takes regex, returns railroad html snippet
      function RR(){
        return '<span>Railroad goes here</span>';
      }

      return {
        RR : RR
      }
    }

})();