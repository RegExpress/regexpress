(function() {
  'use strict';

  angular.module('modifyTreeModule', [])
    .factory('modifyTree', modifyTree);

    function modifyTree(){
      /*
      * Finds and returns a specific node in the tree, and it's parent
      * id: the id of the node we want to find
      * node: the current node in the tree that we are evaluating
      * parent: the parent of the current node we are evaluating.
      */
      var getNode = function(id, node, parent){
        // if these are the same, but not the same type, it will not work (string vs number)
        if(node.idNum === id){
          return {node: node, parent: parent};
        }
        switch(node.type){
          case 'match':
            return searchArray(id, node);
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
            return searchArray(id, node);
          default:
            return null;
        }
      };

      /*
      * Searches through an array for a node with a specific id
      * node: the current node who's body is an array and we need to search through
      * id: the id we are looking for
      */
      var searchArray = function(id, node){
        for(var i = node.body.length-1; i >= 0; i--){
          var child = getNode(id, node.body[i], node);
          if(child){
            return child;
          }
        }
        return null;
      };

      /*
      * Removes all nodes with idToRemove from the regex tree. Returns an array of removed nodes
      * idToRemove: the id of the node we want to remove
      * regexTree: the regex tree
      */ 
      function removeNode(idToRemove, regexTree) {
        var addToNodes = true; // remains true while we need to add the removed nodes to the array we will return
        var nodes = [];

        function traverseTree(idToRemove, regexTree) {
          var nodeAndParent = getNode(idToRemove, regexTree);
          if (nodeAndParent === null || nodeAndParent.parent === undefined) {
            return;
          }
          var node = nodeAndParent.node;
          var parent = nodeAndParent.parent;
          if (addToNodes) {
            nodes.unshift(node);
          }

          // handle checking of group types here
          // charsets are handled by default because their parents are always a type that we have already handled.
          // they can never be a parent.
          if (parent.type === 'match') {
            var indexOfNode = parent.body.indexOf(node);
            parent.body.splice(indexOfNode,1);

            // if our match body is empty, remove the match node as well
            if (parent.body.length === 0) {
              addToNodes = false;
              traverseTree(parent.idNum, regexTree);
            }
            
            // if our match body is not empty, call the function again in case there are more literals with the same id
            if (parent.body.length) {
              traverseTree(idToRemove, regexTree);
            }
          }

          if (parent.type === 'capture-group' || parent.type === 'quantified') {
            // capture groups and quantifieds have a single object as their body. if we are removing that, we should just remove
            // the entire capture group/quantified
            addToNodes = false;
            traverseTree(parent.idNum, regexTree);
          }

          if (parent.type === 'alternate') {
            var parentAndSuperParent = getNode(parent.idNum, regexTree);
            var superParent = parentAndSuperParent.parent;

            //if the superParent is an alternate, set it's right property to the non-removed node
            //if the superParent is a capture group, set it's body property to the non-removed node
            if (superParent.type === 'alternate') {
              if (node === parent.right) {
                superParent.right = parent.left;
              }
              if (node === parent.left) {
                superParent.right = parent.right;
              } 
            } else if (superParent.type === 'capture-group') {
              if (node === parent.right) {
                superParent.body = parent.left;
              }
              if (node === parent.left) {
                superParent.body = parent.right;
              }
            }
          }
          
        }
        traverseTree(idToRemove, regexTree);
        return nodes;
      }

      /*
      * Adds a node to the regex tree
      * siblingId: the id of the sibling immediately to the left of the new node. if undefined, the new node is the first child
      * parentId: the id of the parent of the new node
      * nodeToAdd: the new node to be added to the tree
      * regexTree: the first node in the regexTree
      */
      function addNode(siblingId, parentId, nodeToAdd, regexTree) {
        // find the sibling and parent nodes from their id's
        var siblingAndParent, sibling, parent;
        if (siblingId) {
          siblingAndParent = getNode(siblingId, regexTree);
          sibling = siblingAndParent.node;
          parent = siblingAndParent.parent;
        } else {
          parent = getNode(parentId, regexTree).node; 
        }

        if (parent.type === 'match') { 
          //add the new node after the sibling, or at the beginning
          if (sibling !== undefined) {
            var indexOfSibling = parent.body.indexOf(sibling);
            parent.body.splice(indexOfSibling+1,0,nodeToAdd);
          } else {
            parent.body.unshift(nodeToAdd);
          }
        }

        if (parent.type === 'alternate') {
          //always add the new node at the end of the alternate chain
          if (parent.right.type === 'alternate') {
            // siblingId doesn't matter at this point since we're always adding to end of alternate chain
            // keeping siblingId can cause problems though, just use undefined
            addNode(undefined, parent.right.idNum, nodeToAdd, regexTree);
            return;
          }
          var oldRight = parent.right;
          parent.right = {type: 'alternate', left: oldRight, right: nodeToAdd};
        }

        if (parent.type === 'capture-group') {
          // in theory this shouldnt really happen as itll default to 'match', but this is here just in case.
          addNode(siblingId, parent.body.idNum, nodeToAdd, regexTree);
        }

        if (parent.type === 'quantified') {
          if (parent.body.type === 'literal' || parent.body.type === 'charset') {
            // make parent .body into a capture group w/ the old body
            var oldBody = parent.body;
            parent.body = {type: 'capture-group', body: {type: 'match', body: [oldBody]}};
            
            if (sibling !== undefined) {
              // parent -> capture group -> match -> match's body
              parent.body.body.body.push(nodeToAdd);
            } else {
              parent.body.body.body.unshift(nodeToAdd);
            }
          } else if (parent.body.type === 'capture-group')  {
            addNode(siblingId, parent.body.idNum, nodeToAdd, regexTree);
          }
        }

        if (parent.type === 'charset') {
          //can only add literals or charsets to a charset
          if (nodeToAdd.type === 'charset') {
            for (var i = 0; i < nodeToAdd.body.length; i++) {
              parent.body.push(nodeToAdd.body[i]);
            }
          }

          if (nodeToAdd.type === 'literal') {
            parent.body.push(nodeToAdd);
          }
        }
      }

      /*
      * Finds all nodes with nodeID and replaces them with one a literal node for each letter in newVal.
      * nodeID: the id for the node(s) to replace. the node(s) should be literals
      * newVal: the text to add
      * regexTree: the first node in the regex tree
      */
      function editText(nodeID, newVal, regexTree) {
        var needToAdd = true; // remains true until we've added our newVal

        // if the newVal is empty, just remove the selected node
        if(newVal.length === 0){
          removeNode(nodeID, regexTree);
          return;
        }

        if (typeof nodeID === 'string') {
          nodeID = parseInt(nodeID);
        }

        var nodeAndParent = getNode(nodeID, regexTree);
        var parent = nodeAndParent.parent;

        if (parent.type === 'match') {
          var newBody = [];

          // add all nodes that don't match nodeID to the new body. 
          // if the id equals nodeID, and newVal hasn't been added, add a node for each letter in newVal
          for (var j = 0; j < parent.body.length; j++) {
            if (parent.body[j].idNum !== nodeID) {
              newBody.push(parent.body[j]);
            }
            else {
              if(needToAdd){
                needToAdd = false;
                for(var z = 0; z < newVal.length; z++){
                  newBody.push({type: "literal", offset: z, text: newVal.charAt(z), body: newVal.charAt(z), escaped: false});
                }
              }
            }
          }
          parent.body = newBody;
          parent.text = newVal;
        }

        if (parent.type === 'quantified') {
          // if newVal is one character, set the parent body to a literal object
          if (newVal.length === 1) {
            parent.text = newVal + "?";
            parent.body = {type: "literal", offset: 0, text: newVal, body: newVal, escaped: false};
          } 
          // if newVal is more than one character, set the parent body to a capture group -> match -> literal
          if (newVal.length > 1) {
            var newText = "("  + newVal + ")?";
            parent.text =  newText;
            parent.body = {type: "capture-group", offset: 0, text: newText, body: {} };
            parent.body.body = {type: "match", offset: 0, text: newText, body: [{type: "literal", idNum: -999}]};

            // call editText on the new literal, its parent is a match so it will be handled in the above if statement
            // -999 is used for the id because regular nodes in the tree can only have positive id's,
            // so there's no possibility of accidentally editing the wrong node. this node will be removed,
            // so it's ok that it has a negative id
            editText(-999, newVal, regexTree); 
          }
        }
      }

      return {
        removeNode: removeNode,
        addNode: addNode,
        editText: editText
      };
    }
})();
