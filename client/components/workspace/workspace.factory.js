(function() {
  'use strict';

  angular.module('workspaceModule', [])
    .factory('workspace', workspace);

    function workspace(){

      var componentTable = {
        'start': {'type': 'start'},
        'end': {'type': 'end'},
        'any-character': {'type': 'any-character'},
        'word': {'type': 'word'},
        'non-word': {'type': 'non-word'},
        'digit': {'type': 'digit'},
        'non-digit': {'type': 'non-digit'},
        'white-space': {'type': 'white-space'},
        'non-white-space': {'type': 'non-white-space'}
      };

      function getComponentNode(type){
        return componentTable[type];
      }

    	return {
        getComponentNode: getComponentNode
    	};
    }
})();