(function() {
  'use strict';

  angular.module('modifyTreeModule', [])
    .factory('modifyTree', modifyTree);

    function modifyTree(){

      function removeNode(idToRemove, regexTree) {
        console.log("yo",regexTree);
      }
      

      return {
        removeNode: removeNode,
      };
    }

})();
