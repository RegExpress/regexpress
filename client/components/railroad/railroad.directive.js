(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', ['handlerHelpers', 'modifyTree', 'makeRR', railroad]);

  function railroad(handlerHelpers, modifyTree, makeRR) {

    return {
      restrict: "E",
      replace: true,
      template: '<div class="RR-dir"></div>',
      link: function(scope, element, attrs) {
        // comment all of these
        var item, itemID, location, oldClass, copy, top, left, text, nodeID, saveTree;

        /*
        * Watches the regexp model and re-renders the tree whenever the regexp changes. The scope.main.treeChanged model is incremented to indicate a finished tree change, since the tree itself cannot be watched easily.
        */
        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          scope.main.regexTree = parseRegex(scope.main.regexp);
          scope.main.treeChanged++;
        });

        /*
        * Watches treeChanged model and re-renders and appends the changed diagram each time the tree is done going through an
        * alteration. The $watch function is not used on the tree itself because of the nested and complex nature of the tree, * as a $watched tree will trigger a change each time any change is made during the editing of the tree. We only want to
        * re-render the diagram once at the end of the tree change, and therefore a counter is $watched instead.
        */
        scope.$watch('main.treeChanged', function(newVal, oldVal, scope){
          console.log('tree has changed', scope.main.regexTree);

          var newRR = makeRR.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR +'</div>');
        });

          /////////////////////////////////////////////////////////
         // Main helper functions for the jQuery click handlers //
        /////////////////////////////////////////////////////////

        /*
        * Following a click, finds the closest element that matches the accepted classes for dragging, sets "item" and sets
        * "itemID" as the uinque id of the node to be removed.
        */
        function selectNode(event){
          item = $(event.toElement).closest('.literal-sequence, .literal, .capture-group, .charset, .digit, .non-digit, .word, .non-word, .white-space, .non-white-space, .start, .end, .space, .any-character, .word-boundary ');

          itemID = item.attr('id');
        }

        /*
        * Following a click on a valid diagram node, a copy of the selected node is created and appended to the DOM underneath
        * the mouse, and the original node is grayed out.
        */
        function createCopy(){
          // Create clone of the current item
          copy = $(item).clone()
            .wrap('<svg class="copy" style="position: absolute;"></svg>')
            .parent();

          // Appends the clone to the DOM
          $('.work').append(copy);

          // Gets the Bounding Box of node SVG and remove offset from parent SVG.
          var BBox = $(copy).context.getBBox();
          $(copy).children('g').css('-webkit-transform', 'translate(-'+ (BBox.x -2) +'px,-'+ (BBox.y -2) +'px)')

          // Sets the top and left coords of the clone to appear under the mouse
          $(copy).css({
            top: event.pageY,// - top,
            left: event.pageX// - left
          })

          // Gray out the selected item from the railroad diagram by replacing the class with "ghost". The original class is
          // saved in case the item is "dropped" instead of removed
          oldClass = $(item).attr('class');
          $(item).attr('class','ghost '+ oldClass);
          $('g.ghost rect').css('stroke', 'gray');
        };

        /*
        * Calls ModifyTree function to remove selected node and increments treeChanges model if successful
        */
        function callRemoveNode(intID){
          try {
            modifyTree.removeNode(intID, scope.main.regexTree);
            // $apply must be used to register incrementation of the treeChanged model
            scope.$apply(function(){
              scope.main.treeChanged++;
            });
          } catch (err) {
            console.log('error caught in callRemoveNode', err);
          }
        }

        /*
        * Prepares to edit text on the tree. Detects closest literal-sequence or sequence node to the selected text and appends
        * an input box directly under the mouse containing the current text on the node.  Displays directions for the user
        */
        function editTextNode(event){
          // Set appropriate informative text on info model
          scope.$apply(function(){
            scope.main.info = handlerHelpers.editingText;
          });
          // The node that contains the text to change
          nodeID = $(event.toElement).closest('.literal-sequence, .literal').attr('id');
          text = event.target.innerHTML; // The current text in the diagram node

          // if the text in the node is default text, then initialize the text input box with a placeholder rather than a value attribute
          var valOrPlaceHolder = 'value';
          if (text === '&lt;text_here&gt;') {
            valOrPlaceHolder = 'placeholder';
          }

          var width = text.split('').length * 10;
          var textBox = '<div class="textEdit" style="position: absolute"><form class="textForm"><input class="textBox" type="text" '+ valOrPlaceHolder +'="'+ text +'" autofocus></input></form></div>';

          $('.work').append(textBox);

          $('.textBox').css('width', width); // Set the width of the textBox to fit the contained text

          // Move the textEdit form  to directly under the mouse
          $('.textEdit').css({
            top: event.pageY - 15,
            left: event.pageX - width/2,
          });
        }

        /*
        * Takes an array of nodes or a single node and adds to the tree in the location specified by the parent and left sibling IDs
        */
        function addNode(leftSibID, parentID, node) {
          // saveTree = savedtree || scope.main.regexTree;
          if (Array.isArray(node)) {
            //removeNode from modify-tree factory returns an array that is in order. we need to add last item first, so this for loop 
            //starts at the end of the array and runs to front
            for (var i = node.length-1; i >= 0; i--) {
              try {
                modifyTree.addNode(leftSibID, parentID, node[i], scope.main.regexTree);
              } catch (err) { console.log ('err caught', err);}
            }
          } else {
            try {
              modifyTree.addNode(leftSibID, parentID, node, scope.main.regexTree);
            } catch (err) { console.log ('err caught', err);}
          }
          // trigger tree change to re-render diagram
          scope.$apply(function(){
            scope.main.treeChanged++;
          });
        }

        /*
        * Returns an object with the ID's of the parent node and left sibling node of the selected node. This allows the modify tree function
        * to correctly locate a specific spot on the tree
        */
        function findRelatives(event) {
          var relatives = {};

          // finds closest parent of match or quantified type, sets ID on relatives object
          var parentID = $(event.toElement).closest('.match, .quantified').attr('id');
          relatives.parentID = parseInt(parentID);

          relatives.leftSibID = handlerHelpers.findLeftSibling(event);

          if (relatives.leftSibID === undefined && relatives.parentID === undefined){
            console.log('no parent node and no left sibling. Drop the copy and revert. YOU GET NOTHINGGGGG');
            return;
          }
          return relatives;
        }

         ////////////////////////////
        // jQuery event handlers ///
        ///////////////////////////

        /*
        * Allows the user to change text on a node. When the text edit form is submitted, the new text is passed into the
        * modifyTree function, which will insert that text into the indicated node on the tree
        */
        $('.work').on('submit','.textForm', function(event){
          event.preventDefault();
          var newVal = $('.textBox').val(); // Get contents of text box

          // Triggers modification of tree to insert new text
          scope.main.savedRegexTrees.push(JSON.stringify(scope.main.regexTree));
          modifyTree.editText(parseInt(nodeID), newVal, scope.main.regexTree, text); // TODO figure out where the hell I'm using text, this only takes 3 arguments. FIX IT
          $('.textEdit').remove(); // removes the form

          // Update informative text and increments treeChanged counter to trigger re-rendering of diagram
          scope.$apply(function(){
            scope.main.info = handlerHelpers.building;
            scope.main.treeChanged++;
          });
        });

        /*
        * Changes the width of the text form to fit the contents
        */
        $('.work').on('keydown', '.textForm', function(){
          //check length of input, change width of input box to match contents
          var width = 10 + $('.textBox').val().length * 10;
          $('.textBox').css('width', width);
        })

        /*
        * Removes text form on mousedown unless the event is on the form itself
        */
        $('.work').on('mousedown', function(event){
          if (text === undefined && $(event.target).attr('class') !== 'textBox'){
            $('.textEdit').remove();
            scope.$apply(function(){
              scope.main.info = handlerHelpers.building;
            });
          }
        })

        /*
        * Handles mousedown over the railroad diagram.
        * If the scope.main.mode model is set to "add", then a captured node  /// TODO clarify after removal of scope.main.mode
        * from the workspace will be added to the target area.
        * if the model is not set to add and the user is clicking on a text area, prep for text editing.
        * Otherwise, the clicked diagram node will be prepared for dragging and possible removal
        */
        element.on('mousedown','.railroad-diagram',function(event){
          // if the click is a left click
          if (event.which === 1) {
            $('.textEdit').remove();
            // if the selected element is the text child of a literal node, run change text function
            if ($(event.toElement).is('text') && $(event.toElement).closest('.literal-sequence')[0] != undefined ){
              editTextNode(event);
            } else {
            // The user is not trying to change text. select the node to prepare for moving/removal
              selectNode(event);
              createCopy();
            }
          }
        });

        /*
        * This functionality allows the user to add components from the library, move nodes on the railroad, and remove nodes by dragging to the trash can.
        * Checks the location of the mouse on mouseup.  If the mouse is over a valid drop target location, the selected node is added there.
        * If the mouse is over the trash can, the selected node is removed. If the mouse is anywhere else, the copy is removed, the diagram is 
        * reverted back to normal and no changes are made.
        */

        $('.work').on('mouseup', function(event) {
          // If user is not trying to add or move/remove a node, do nothing
          if (!scope.main.nodeToAdd && !item) {
            return;
          }

          var intID = parseInt(itemID); // Convert the saved itemID into an integer

          // Check location of mouse event. Creates an object with class and id attributes
          var overElem = event.toElement;
          var over = {
            class: $(overElem).attr('class'),
            id: $(overElem).attr('id')
          }
          // bug: if user clicks on node for text to edit, it removes the whole selected node. Re assign item better.  
          var overSelf = handlerHelpers.isOverSelf(event, itemID); // true if you are over the selected node, or next to it on the railroad (NOT 100% WORKING)
          var overValidTarget = true; // TODO set up a checkIfOverValid target setup, possibly in tandem with findRelatives

          // If over trash, remove selected node
          if (over.id === 'trash') {
            scope.main.savedRegexTrees.push(JSON.stringify(scope.main.regexTree));
            callRemoveNode(intID);
            
          } else if ( (!scope.main.nodeToAdd && overSelf) || over.class === 'ng-pristine ng-valid' || 
            over.class === 'question question-regextest' || over.class === 'question question-railroad' || 
            over.class === 'question question-regexinput' || over.class === 'test-text ng-pristine ng-untouched ng-valid' ||
            over.class === 'regex-input regex ng-pristine ng-untouched ng-valid' || 
            over.class === 'regex-input flag ng-pristine ng-untouched ng-valid' ||
            over.class === 'regex-slash' || over.class === 'start' || over.class === 'end' ||
            over.class === 'RR' || over.class === 'railroad-diagram' || over.class === 'work') {
            // if we drop the item anywhere in the workspace that's not the trashcan or railroad, put the selected item back in it's original spot
            $('g.ghost rect').css('stroke', 'black');
            $(item).attr('class', oldClass);

          } else if ( overValidTarget ) {
            var targetLocation = findRelatives(event); // an object containing the parent and left sibling IDs of location to add to

            // If not adding a node from the library, move currently selected node
            if (!scope.main.nodeToAdd){
              scope.main.savedRegexTrees.push(JSON.stringify(scope.main.regexTree));
              var removedArray = modifyTree.removeNode(intID, scope.main.regexTree); //removes picked up node from tree, returns removed node(s)
              addNode(targetLocation.leftSibID, targetLocation.parentID, removedArray); //adds in removed node(s) to new location
            } else {
              scope.main.savedRegexTrees.push(JSON.stringify(scope.main.regexTree));
              addNode(targetLocation.leftSibID, targetLocation.parentID, scope.main.nodeToAdd); //add new node from library
            }
          }

          // remove the copy that's probably still floating around and clear all holder variables
          $(copy).remove();
          text = undefined;
          scope.main.nodeToAdd = undefined;
          itemID = undefined;
          item = undefined;
        });

        /*
        * Allows for the mouse to drag copy around
        */
        $('.work').on('mousemove', function(event){
          if (item && copy) {
            $(copy).css({
              top:  event.pageY + 5,// - top,
              left: event.pageX + 5//- left
            })
          }
        })

        // Becaue :hover does not activate during a drag, these mousemove and mouseout functions must be used to create the highlighting effect
        $('.work').on('mousemove', 'rect, g.match > path, g.literal-sequence > path', function(){
          this.style.stroke = '#E45F56';
          // make cursor pointer
          $('body').addClass('svg-hover');
        })
        $('.work').on('mouseout', 'rect, g.match > path, g.literal-sequence > path', function(){
          this.style.stroke = 'black';
          $('body').removeClass('svg-hover');
        })
      }
    }
  }
})();
