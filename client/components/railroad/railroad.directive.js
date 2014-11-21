(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', ['handlerHelpers', 'modifyTree', 'makeRR', 'workspace', railroad]);

  function railroad(handlerHelpers, modifyTree, makeRR, workspace) {

    return {
      restrict: "E",
      replace: true,
      template: '<div class="RR-dir"></div>',
      link: function(scope, element, attrs) {

        var item, itemID, location, oldClass, copy, top, left, text, nodeID;

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
          item = $(event.toElement).closest('.literal-sequence, .literal, .capture-group, .charset, .digit, .non-digit, .word, .non-word, .white-space, .non-white-space, .start, .end, .space ');
          itemID = item.attr('id');
        }

        /*
        * Following a click on a valid diagram node, a copy of the selected node is created and appended to the DOM underneath
        * the mouse, and the original node is grayed out.
        */
        function createCopy(){
          // Create clone of the current item
          copy = $(item).clone()
            .attr('fill', 'black')
            .wrap('<svg class="copy" style="position: absolute;"></svg>')
            .parent();

          // Appends the clone to the DOM
          $('.work').append(copy);

          // Determines the offset of the rect (diagram node image) from the wrapping svg, calculates halfway point
          var target = $(copy).find('rect');
          top = ($(target).position().top) + ($(target).attr('height')/2);
          left = ($(target).position().left) + ($(target).attr('width')/2);

          // Sets the top and left coords of the clone to appear under the mouse
          $(copy).css({
            top: event.pageY - top,
            left: event.pageX - left
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
        };

        /*
        * Prepares to edit text on the tree. Detects closest literal-sequence or sequence node to the selected text and appends
        * an input box directly under the mouse containing the current text on the node.  Displays directions for the user
        */
        function editTextNode(event){
          // Set appropriate informative text on info model
          scope.$apply(function(){
            scope.main.info = handlerHelpers.editingText;
          })
          // The node that contains the text to change
          nodeID = $(event.toElement).closest('.literal-sequence, .literal').attr('id');
          text = event.target.innerHTML; // The current text in the diagram node
          var width = text.split('').length * 7;
          var textBox = '<div class="textEdit" style="position: absolute"><form class="textForm"><input class="textBox" type="text" value="'+ text +'" autofocus></input></form></div>';

          $('.work').append(textBox);

          $('.textBox').css('width', width); // Set the width of the textBox to fit the contained text

          // Move the textEdit form  to directly under the mouse
          $('.textEdit').css({
            top: event.pageY - 15,
            left: event.pageX - width/2,
          });
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
          modifyTree.editText(parseInt(nodeID), newVal, scope.main.regexTree, text);
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
        $('.work').on('keyup', '.textForm', function(){
          //check length of input, change width of input box to match contents
          var width = $('.textBox').val().split('').length * 8;
          $('.textBox').css('width', width);
        })

        /*
        * Removes text form on mousedown unless the event is on the form itself
        */
        $('.work').on('mousedown', function(event){
          if (text === undefined && $(event.target).attr('class') != 'textBox'){
            $('.textEdit').remove();
            scope.$apply(function(){
              scope.main.info = handlerHelpers.building;
            });
          }
        })

        /*
        * Handles mousedown over the railroad diagram.
        * If the scope.main.mode model is set to "add", then a captured node
        * from the workspace will be added to the target area.
        * if the model is not set to add and the user is clicking on a text area, prep for text editing.
        * Otherwise, the clicked diagram node will be prepared for dragging and possible removal
        */
        element.on('mousedown','.railroad-diagram',function(event){
          // if the click is a left click
          if (event.which === 1) {
            // check if the user is trying to add a node
            if (scope.main.mode === 'add') {
              // do the adding stuff

            } else {
            // The user is not trying to add a node. Check if the user is trying to change test.

              // if the selected element is the text child of a literal node, run change text function
              if ($(event.toElement).is('text') && $(event.toElement).closest('.literal-sequence')[0] != undefined ){
                editTextNode(event);
              } else {
              // The user is not trying to add a node or change text. Prepare the node for removal
                selectNode(event);
                createCopy();
              }
            };

          } else if (event.which === 3) {

            /// testing for click-to-add functionality //////////////////

            /// this is the hard coded node type to add 
            var type = 'text';
            var nodeToAdd = workspace.getComponentNode(type);

            var parentID = $(event.toElement).closest('.match, .quantified').attr('id');
            parentID = parseInt(parentID);
            var leftSib = handlerHelpers.findLeftSibling(event);

            if (leftSib === undefined && parentID === undefined){
              console.log('no parent node and no left sibling. Drop the copy and revert');
            } else {
              console.log('leftSibling', leftSib, 'parentID', parentID, scope.main.regexTree);
              modifyTree.addNode(leftSib, parentID, nodeToAdd, scope.main.regexTree);
              scope.$apply(function(){
                scope.main.treeChanged++;
              })
            }
            /////////////// most of this will get moved to workspace.directive /////

          }
        })

        /*
        * Checks the location of the mouse on mouseup. If the mouse is inside the diagram, the copy is removed, the diagram is
        * reverted back to normal and no changed are made. Otherwise, the selected node is removed.
        */

        // Removed item from tree on mouseup if off the RR
        $('.work').on('mouseup', function(event) {
          // Checks if item is currently defined
          if (item){
            // check location of mouse event
            var over = handlerHelpers.checkUnder(event);
            // if off the railroad, remove selected node
            if (over === 'RR' || over === 'undefined' || over === 'work') {
              var intID = parseInt(itemID)
              callRemoveNode(intID);
            } else {
              // un-gray the dropped item, add back old class
              $('g.ghost rect').css('stroke', 'black');
              $(item).attr('class', oldClass);
            }
            item = undefined; // sets item back to undefined
          }
          $(copy).remove();
          text = undefined;
        });

        /*
        * Allows for the mouse to drag copy around
        */
        $('.work').on('mousemove', function(event){
          if (item && copy) {
            $(copy).css({
              top:  event.pageY - top,
              left: event.pageX - left
             })
          }
        })
      }
    }
  }
})();
