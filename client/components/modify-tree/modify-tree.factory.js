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
        // if these are the same, but not the same type, it will not work (literals)
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
      * Removes a specific node from the regex tree
      * idToRemove: the id of the node we want to remove
      * regexTree: the regex tree
      */ 
      function removeNode(idToRemove, regexTree) {
        // console.log("yo",regexTree);
        var nodeAndParent = getNode(idToRemove, regexTree);
        if (nodeAndParent === null || nodeAndParent.parent === undefined) {
          return;
        }
        var node = nodeAndParent.node;
        var parent = nodeAndParent.parent;
        // handle checking of group types here
        // charsets are handled by default because their parents are always a type that we have already handled.
        // they can never be a parent.
        // Is match
        if (parent.type === 'match') {
          var indexOfNode = parent.body.indexOf(node);
          parent.body.splice(indexOfNode,1);
          // this is for if the body is now empty
          // it removes the object that has the empty body array.
          // not 100% sure this works for capture groups as well
          if (parent.body.length === 0) {
            removeNode(parent.idNum, regexTree);
          }
          // if more of same id , delete those also
          // while in body, there exists more nodes with same idNum, delete them.
          if (parent.body.length) {
            removeNode(idToRemove, regexTree);
          }
        }
        // capture groups && quantifieds
        if (parent.type === 'capture-group' || parent.type === 'quantified') {
          removeNode(parent.idNum, regexTree);
        }
        /// alternates
        if (parent.type === 'alternate') {
          var parentAndSuperParent = getNode(parent.idNum, regexTree);
          var superParent = parentAndSuperParent.parent;
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
      // we probably need an actually complete node to be passed in, and the place to add it.
      // should this be called addNodeBefore? We also need addNodeTo
      function addNode(siblingId, parentId, nodeToAdd, regexTree) {
        // console.log('adding node');
        // different cases depending on parent type
        var siblingAndParent, sibling, parent;
        if (siblingId) {
          siblingAndParent = getNode(siblingId, regexTree);
          sibling = siblingAndParent.node;
          parent = siblingAndParent.parent;
        } else {
          parent = getNode(parentId, regexTree).node; 
        }
        if (parent.type === 'match') { 
          // do this is sibling node is defined
          if (sibling !== undefined) {
            var indexOfSibling = parent.body.indexOf(sibling);
            parent.body.splice(indexOfSibling+1,0,nodeToAdd);
          } else {
            parent.body.unshift(nodeToAdd);
          }
        }
        if (parent.type === 'alternate') {
          if (parent.right.type === 'alternate') {
            addNode(siblingId, parent.right.idNum, nodeToAdd, regexTree);
            return;
          }
          var oldRight = parent.right;
          parent.right = {type: 'alternate', left: oldRight, right: nodeToAdd};
        }
        if (parent.type === 'capture-group') {
          // if capture group, just call addNode on the match inside of it
          // in theory this shouldnt really happen as itll default to 'match', but this is here just in case.
          addNode(siblingId, parent.body.idNum, nodeToAdd, regexTree);
          return;
        }
        if (parent.type === 'quantified') {
          // if its a literal character, the body will just be a literal node
          if (parent.body.type === 'literal' || parent.body.type === 'charset') {
            // make parent .body into a capture group w/ a literal
            var oldBody = parent.body;
            parent.body = {type: 'capture-group', body: {type: 'match', body: [oldBody]}};
            // if sibling, after else before
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

      function editText(nodeID, newVal, regexTree) {
        // currently only works for liteals in a match. a quantified needs to be worke don
        // quantifieds have a single object
        if (typeof nodeID === 'string') {
          nodeID = parseInt(nodeID);
        }
        // get tree, get node, remove all nodes, add new nodes based on newVal
        var nodeAndParent = getNode(nodeID, regexTree);
        // var node = nodeAndParent.node;
        var parent = nodeAndParent.parent;
        // remove children from parent node
        if (parent.type === 'match') {
          // remove all nodes with same id
          var newBody = [];
          for (var j = 0; j < parent.body.length; j++) {
            if (parent.body[j].idNum !== nodeID) {
              newBody.push(parent.body[j]);
            }
          }
          parent.body = newBody;
          parent.text = newVal;
          for (var i = 0; i < newVal.length; i++) {

            parent.body.push({type: "literal", offset: i, text: newVal.charAt(i), body: newVal.charAt(i), escaped: false});
          } 
        }
        if (parent.type === 'quantified') {
          // if newVal is one character
          if (newVal.length === 1) {
            parent.text = newVal + "?";
            parent.body = {type: "literal", offset: 0, text: newVal, body: newVal, escaped: false};
          } 
          // if newVal is more than one character
          if (newVal.length > 1) {
            // capture group match, then all literals
            var newText = "("  + newVal + ")?";
            parent.text =  newText;
            // set the quantifieds body to now be a capture group
            parent.body = {type: "capture-group", offset: 0, text: newText, body: {} };
            // then set the capture groups body to be a match
            // this makes the data structure one that we can already deal with (adding to a literal)
            // so we set the id to something unique, and handle it as if it was editing text to a literal.
            parent.body.body = {type: "match", offset: 0, text: newText, body: [{type: "literal", idNum: -999}]} ;
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
