(function() {
  'use strict';

  angular.module('modifyTreeModule', [])
    .factory('modifyTree', modifyTree);

    function modifyTree(){
      // parent node is needed for subsequent recursive calls
      var getNode = function(id, node, parent){
        if(node.idNum === id){
          return [node, parent];
        }
        switch(node.type){
          case 'match':
            return searchArray(node, id);
          case 'capture-group':
            return getNode(id, node.body, node);
          case 'alternate':
            var left = getNode(id, node.left, node);
            if(left){
              return left;
            }
            return getNode(id, node.right, node);
          case 'quantified':
            return getNode(id, node.body, node);
          case 'charset':
            return searchArray(node, id);
          default:
            return null;
        }
      };

      var searchArray = function(node, id){
        for(var i = 0; i < node.body.length; i++){
          var child = getNode(id, node.body[i], node);
          if(child){
            return child;
          }
        }
        return null;
      };

      function removeNode(idToRemove, regexTree) {
        // console.log("yo",regexTree);
        var nodeAndParent = getNode(idToRemove, regexTree);
        var node = nodeAndParent[0];
        var parent = nodeAndParent[1];
        // if body is array, splice
        // handle checking of group types here
        if (parent.type === 'match' || parent.type ==='capture-group') {
          var indexOfNode = parent.body.indexOf(node);
          parent.body.splice(indexOfNode,1);
          // this is for if the body is now empty
          // it removes the object that has the empty body array.
          // not 100% sure this works for capture groups as well
          if (parent.body.length === 0) {
            removeNode(parent.idNum, regexTree);
          }
        }
        if (parent.type === 'alternate') {
          var parentAndSuperParent = getNode(parent.idNum, regexTree);
          var superParent = parentAndSuperParent[1];
          if (node === parent.right) {
            superParent.right = parent.left;
          }
          if (node === parent.left) {
            superParent.left = parent.right;
          }

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
