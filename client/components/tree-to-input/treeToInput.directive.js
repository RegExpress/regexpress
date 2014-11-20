

(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('treeToInput', treeToInput);

  // watches changing user regex input and changes scope variable regexp to reflect this
  function treeToInput() {

    return {
      restrict: "E",

      template: '<div>tree to input directive</div>',
      link: function(scope, element, attrs) {
        /*
        * Traverses a regex tree and builds the equivalent regex string.
        * node: the current node in the regex tree to be evaluated.
        */
        var buildRegexString = function(node){
          var regex = '';
          switch(node.type){
            case 'match':
              for(var i = 0; i < node.body.length; i++){
                regex += buildRegexString(node.body[i]);
              }
              return regex;
            case 'capture-group':
              return '(' + buildRegexString(node.body) + ')';
            case 'literal':
              var text = node.body;
              for(var i = 0; i < text.length; i++){
                //Add a \ if it's a character that needs to be escaped
                if(isSpecial(text[i])){
                  regex += '\\';
                }
                regex += text[i];
              }
              return regex;
            case 'alternate':
              return buildRegexString(node.left) + '|' + buildRegexString(node.right);
            case 'quantified':
              var body = buildRegexString(node.body);

              //MIGHT NOT BE NECESSARY
              //Only add () if the text length is greater than 1, the first character is not (, and its not a single escaped character
              if(body.length > 1 && body[0] !== '(' && (body.length !== 2 || body[0] !== '\\')){
                regex += '(' + body + ')';
              } else {
                regex += body;
              }

              var min = node.quantifier.min;
              var max = node.quantifier.max;
              //Maybe just replace Infinity with null below
              if(max === null){
                max = Infinity;
              }
              if(min > max){
                throw new Error("Minimum quantifier (" + min + ") must be lower than maximum quantifier (" + max + ")");
              }
              if(min === 0 && max === Infinity){
                regex += '*';
              } else if(min === 1 && max === Infinity){
                regex += '+';
              } else if(min === 0 && max === 1){
                regex += '?';
              } else if(min === max){
                regex += '{' + min + '}';
              } else {
                regex += '{' + min + ',' + max + '}';
              }
              return regex;
            case 'charset':
              regex += '[';
              if(node.invert){
                regex += '^';
              }
              //Specials inside a charset don't all need to be escaped, but it should be ok if they all are
              for(var i = 0; i < node.body.length; i++){
                regex += buildRegexString(node.body[i]);
              }
              regex += ']';
              return regex;

            //THIS MIGHT BE WRONG
            case 'range':
              return node.text;

            case 'start':
              return '^';
            case 'end':
              return '$';
            case 'word':
              return '\\w';
            case 'non-word':
              return '\\W';
            case 'any-character':
              return '.';
            case 'digit':
              return '\\d' ;
            case 'non-digit':
              return '\\D' ;
            case 'white-space':
              return '\\s' ;
            case 'non-white-space':
              return '\\S' ;
            case 'word-boundary':
              return '\\b';
            case 'non-word-boundary':
              return '\\B';
            case 'tab':
              return '\\t';
            case 'carriage-return':
              return '\\r';
            case 'vertical-tab':
              return '\\v';
            case 'form-feed':
              return '\\f';
            case 'line-feed':
              return '\\n';
            default:
              return regex;
          }
        };

        /*
        * Helper function to determine if a character needs to be escaped
        */
        var isSpecial = function(char){
          if(char === '/' || char === '*' || char === '+' || char === '?' || char === '\\' || char === '(' || char === ')' || char === '{' ||
            char === '[' || char === '.' || char === '$' || char === '^' || char === '|') {
            return true;
          }
          return false;
        };

        scope.$watch('main.treeChanged', function(newValues, oldValues){
          // console.log(scope.main.treeChanged);
          // console.log(buildRegexString(scope.main.regexTree));
          scope.main.regexBody = buildRegexString(scope.main.regexTree);
        });
      }
    };
  }

})();
