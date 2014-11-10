(function() {
  'use strict';

  angular.module('makeRailroad', [])
    .factory('createRailroad', createRailroad);

    function createRailroad(){
      // takes regex, returns railroad html snippet
      function RR(regex){

        var snippet = Regex2RailRoadDiagramCopy(regex);
        return '<div class="RR">'+ snippet + '</dvi>';

      }

      // makes this function accessible by the controller
      return {
        RR : RR
      }
    }

})();