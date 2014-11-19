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

        var item, itemID, location, oldClass, copy, top, left, text, nodeID;

        // makes railroad diagram and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal, scope){

          scope.main.regexTree = parseRegex(scope.main.regexp);
          scope.main.treeChanged++;
          // for testing purposes
          window.regexpTree = scope.main.regexTree;
        });

        // watches tree counter, which is tripped every time the tree is DONE changing.
        // Creates and appends new Railroad diagram
        scope.$watch('main.treeChanged', function(newVal, oldVal, scope){
          var newRR = makeRR.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR +'</div>');
        });

        ////////// jQuery click handlers ///////////

        // finds the closest element that matches the accepted classes, sets to "item", gets ID of the node to be removed.
        function selectNode(event){
          item = $(event.toElement).closest('.literal-sequence, .literal, .capture-group, .charset, .digit, .non-digit, .word, .non-word, .white-space, .non-white-space, .start, .end, .space ');
          itemID = item.attr('id');
        }

        function createCopy(){
          // create clone and append to DOM
          copy = $(item).clone()
            .attr('fill', 'black')
            .wrap('<svg class="copy" style="position: absolute;"></svg>')
            .parent();

          // appends the clone to the DOM
          $('.work').append(copy);

          // find out the offset of the rect from the svg
          var target = $(copy).find('rect');
          top = ($(target).position().top) + ($(target).attr('height')/2);
          left = ($(target).position().left) + ($(target).attr('width')/2);

          // sets the top and left coords of the clone to appear under the mouse
          $(copy).css({
            top: event.pageY - top,
            left: event.pageX - left
          })

          // gray out the selected item
          oldClass = $(item).attr('class');
          $(item).attr('class','ghost '+ oldClass);
          $('g.ghost rect').css('stroke', 'gray');
        };

        function askToRemoveNode(event){
          var over = handlerHelpers.checkUnder(event);

          if (over === 'RR' || over === 'undefined' || over === 'work') {
            var intID = parseInt(itemID)
            try {
              modifyTree.removeNode(intID, scope.main.regexTree);
              console.log('removed node', item)
            } catch (err) { console.log('error caught', err); }
            scope.$apply(function(){
              scope.main.treeChanged++;
            });

          } else {
            // un-gray the dropped item, add back old class
            $('g.ghost rect').css('stroke', 'black');
            $(item).attr('class', oldClass);
          }

          item = undefined;
          $(copy).remove();
        };

        function callChangeText(node, newVal, oldVal){
          console.log('now changing text on node:', node,'from ', oldVal , 'to ', newVal);
        }

        function editTextNode(event){
          nodeID = $(event.toElement).closest('.literal-sequence, .literal').attr('id');
          text = event.target.innerHTML;
          var width = text.split('').length * 7;
          var textBox = '<div class="textEdit" style="position: absolute"><form class="textForm"><input class="textBox" type="text" value="'+ text +'" autofocus></input></form></div>';
          // set appropriate informative text on scope
          scope.$apply(function(){
            // scope.main.info 
          })

          $('.work').append(textBox);

          $('.textBox').css('width', width);

          $('.textEdit').css({
            top: event.pageY - 15,
            left: event.pageX - width/2,
          });

        }

        $('.work').on('submit','.textForm', function(event){
          event.preventDefault();
          var newVal = $('.textBox').val();
          console.log("here's where you call editText");
          // modifyTree.editText(parseInt(nodeID), newVal, scope.main.regexTree, text);
          $('.textEdit').remove();
        })

        $('.work').on('keyup', '.textForm', function(){
          //check length of input, change width of input box to match contents
          var width = $('.textBox').val().split('').length * 8;
          $('.textBox').css('width', width);
        })

        // set selected item and itemID
        element.on('mousedown','.railroad-diagram',function(event){

          if (event.which === 1) {
            // if the selected element is the text child of a literal node, run change text function
            if ($(event.toElement).is('text') && $(event.toElement).closest('.literal-sequence')[0] != undefined ){
              editTextNode(event);
            // else, prep the node for removal
            } else {
              selectNode(event);
              createCopy();
            };
          } else if (event.which === 3) {
            console.log($(item))
          }
        })

        // removed item from tree on mouseup if off the RR
        $('.work').on('mouseup', function(event) {
          if (item){
            askToRemoveNode(event);
          }
        });

        // allows for the mouse to drag copy around
        $('.work').on('mousemove', function(event){
          if (item) {
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
