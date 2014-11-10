(function() {
  'use strict';

  angular.module('makeRailroad', [])
    .factory('createRailroad', createRailroad);

    function createRailroad(){
      // takes regex parts, returns railroad html snippet
      function RR(rBody, rTags){

        // create the new regex, make snippet
        var re = new RegExp(rBody, rTags)
        var snippet = Regex2RailRoadDiagramCopy(re);
        return snippet;
      }

      // makes this function accessible by the controller
      return {
        RR : RR
      }
    }

})();