(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', railroad);

  function railroad() {

    return {
      restrict: "E",
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attrs) {

        // makes railroad diagram and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          console.log("parsing regex");
          scope.main.regexTree = parseRegex(scope.main.regexp);
          var newRR = scope.rr.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR+'</div>');
        });

        // element.on('click', function(event){
        //   // console.log(event.toElement);
        //   $(event.toElement).parents()
        //     .map(function(){
        //     console.log(this.classList);
        //   })
        // });

        element.on('click', 'path, rect', function(event){
          $(event.currentTarget).css('stroke', 'rgb(255, 0, 0)');
        })




        var changeColor = function(event){
          if ($(event.toElement).css('fill') === 'rgb(255, 0, 0)') {
            $(event.toElement).css('fill', 'rgb(178, 225, 231)')
          } else {
            $(event.toElement).css('fill', 'rgb(255, 0, 0)');
          }
          event.stopPropagation();

        }

        var changeBack = function(event){
          console.log('leaving')
          var target = $(event.toElement);
          var originalColor = $(target).data('originalColor');
          console.log('fetch', originalColor);
          $(target).css('fill', ' hsl(240, 100%, 27%)');
        }

        // change color back to whatever it was.
        // element.on('mouseenter','.terminal, .sequence, .choice, .group', changeColor);
        // element.on('mouseout','.terminal, .sequence, .choice, .group', changeColor);

        // element.on('click', '.terminal, .sequence, .choice, .group', function(event){
        //   console.log(event.toElement.classList.add('on'));
        //   console.log($(event.toElement).css('fill'));
        //   event.stopPropagation();
        // })

        // '.terminal, .sequence, .choice, .group'

      }
    }
  }
})();
