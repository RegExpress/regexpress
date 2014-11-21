(function() {
  'use strict';

  angular.module('workspaceModule', [])
    .factory('workspace', workspace);

    function workspace(){

      var text = {'type': 'match', 'body': [{'type': 'literal', 'body': 'a'}, {'type': 'literal', 'body': 'b'}, {'type': 'literal', 'body': 'c'}]} 

      var componentTable = {
        'start': {'type': 'start'},
        'end': {'type': 'end'},
        'any-character': {'type': 'any-character'},
        'word': {'type': 'word'},
        'non-word': {'type': 'non-word'},
        'digit': {'type': 'digit'},
        'non-digit': {'type': 'non-digit'},
        'white-space': {'type': 'white-space'},
        'non-white-space': {'type': 'non-white-space'},
        'text': text,
        'capture-group': {'type': 'capture-group', 'body': text},
        'alternate': {'type': 'alternate', 'left': text, 'right': text},
        'optional': {'type': 'quantified', 'body': text, 'quantifier': {'min': 0, 'max': 1}},
        'repeating': {'type': 'quantified', 'body': text, 'quantifier': {'min': 1, 'max': Infinity}}
      };

      function getComponentNode(type){
        return componentTable[type];
      }

    	return {
        getComponentNode: getComponentNode
    	};
    }
})();