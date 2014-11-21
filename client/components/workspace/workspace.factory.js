(function() {
  'use strict';

  angular.module('workspaceModule', [])
    .factory('workspace', workspace);

    function workspace(){

      var componentTable = {
        
      };

      function getComponentNode(type){

      }

    	return {
        getComponentNode: getComponentNode
    	};
    }
})();