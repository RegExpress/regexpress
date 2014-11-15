(function() {
  'use strict';

  angular.module('modifyTreeModule', [])
    .factory('modifyTree', modifyTree);

    function modifyTree(){
      // parent node is needed for subsequent recursive calls
      var getNode = function(node, id, parent){
        if(node.idNum === id){
          return [node, parent];
        }
        switch(node.type){
          case 'match':
            return searchArray(node, id);
          case 'capture-group':
            return getNode(node.body, id, node);
          case 'alternate':
            var left = getNode(node.left, id, node);
            if(left){
              return left;
            }
            return getNode(node.right, id, node);
          case 'quantified':
            return getNode(node.body, id, node);
          case 'charset':
            return searchArray(node, id);
          default:
            return null;
        }
      };

      var searchArray = function(node, id){
        for(var i = 0; i < node.body.length; i++){
          var child = getNode(node.body[i], id, node);
          if(child){
            return child;
          }
        }
        return null;
      };

      function removeNode(idToRemove, regexTree) {
        // console.log("yo",regexTree);
        var nodeAndParent = getNode(regexTree, idToRemove);
        var node = nodeAndParent[0];
        var parent = nodeAndParent[1];
        console.log(nodeAndParent);
        // if body is array, splice
        // handle checking of group types here
        if (parent.type === "match" || parent.type ==="capture-group") {
          var indexOfNode = parent.body.indexOf(node);
          parent.body.splice(indexOfNode,1);
        }
        
        // if thing we need to remove is in a alternate, do other stuff
      }
      // for testing only
      window.globalRemoveNode = removeNode;
      

      return {
        removeNode: removeNode,
      };
    }

})();
