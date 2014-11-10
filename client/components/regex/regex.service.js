(function() {
  'use strict';

  angular.module('makeRailroad', [])
    .factory('createRailroad', createRailroad);

    function createRailroad(){
      // takes regex, returns railroad html snippet
      function RR(rBody, rTags){
        // stub regex
        // var re = /[a-z]+/ig;
        var re = new RegExp(rBody, rTags)
        console.log('new regex is', re)

        var snippet = Regex2RailRoadDiagramCopy(re);

        // return snippet;
        console.log('snippet created');
        return snippet;
      }

      return {
        RR : RR
      }
    }

})();