var parse = require("regexp"); //Used to parse a regular expression

//Functions for drawing the different railroad blocks
var railroad = require('./railroad-diagrams');
var Diagram = railroad['Diagram'];
var Sequence = railroad['Sequence'];
var Choice = railroad['Choice'];
var Optional = railroad['Optional'];
var OneOrMore = railroad['OneOrMore'];
var ZeroOrMore = railroad['ZeroOrMore'];
var Terminal = railroad['Terminal'];
var NonTerminal = railroad['NonTerminal'];
var Comment = railroad['Comment'];
var Skip = railroad['Skip'];
var Group = railroad['Group'];

//Might have some problems
var makeLiteral = function(text) {
  if (text === " ") {
    return NonTerminal("SP");
  } else {
    var parts = text.split(/(^ +| {2,}| +$)/);
    var sequence = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      //DOUBLE CHECK IF THIS IF STATEMENT IS CORRECT
      if (!part.length) {
        continue;
      }
      if (/^ +$/.test(part)) {
        if (part.length === 1) {
          sequence.push(NonTerminal("SP"));
        } else {
          sequence.push(OneOrMore(NonTerminal("SP"), Comment("" + part.length + " times")));
        }
      } else {
        sequence.push(Terminal(part));
      }
    }
    if (sequence.length === 1) {
      return sequence[0];
    } else {
      return new Sequence(sequence);
    }
  }
};

/*
* Recursive function to convert a parsed regular expression to railroad blocks.
* The parsed regular expression will be a bunch of nested objects, and the type property
* determines how the object needs to be handled and which railroad block format will be used.
* node: The current object in the parsed regular expression tree to be evaluated
*/
var rx2rr = function(node) {
  console.log('node from rx2rr', JSON.stringify(node));
  switch (node.type) {
    case "match":
      var literal = null;
      var sequence = [];
      for (var i = 0; i <  node.body.length; i++) {
        var currentNode = node.body[i];
        if (currentNode.type === "literal" && !currentNode.escaped) {
          if (literal != null) {
            literal += currentNode.body;
          } else {
            literal = currentNode.body;
          }
        } else {
          if (literal != null) {
            sequence.push(makeLiteral(literal));
            literal = null;
          }
          sequence.push(rx2rr(currentNode));
        }
      }
      if (literal != null) {
        sequence.push(makeLiteral(literal));
      }
      if (sequence.length === 1) {
        return sequence[0];
      } else {
        return new Sequence(sequence);
      }
      break;
    case "alternate": //Handles (a|b|c) blocks
      var alternatives = [];
      while (node.type === "alternate") {
        alternatives.push(rx2rr(node.left));
        node = node.right;
      }
      alternatives.push(rx2rr(node));
      return new Choice(Math.ceil(alternatives.length / 2) - 1, alternatives);
    case "quantified": //Handles multiples (+, *, {4}, etc.) of an expression
      var quantifier = node.quantifier; 
      var min = quantifier.min; 
      var max = quantifier.max;
      var body = rx2rr(node.body);
      if (!(min <= max)) {
        throw new Error("Minimum quantifier (" + min + ") must be lower than maximum quantifier (" + max + ")");
      }
      switch (min) {
        case 0:
          if (max === 1) {
            return Optional(body);
          } else {
            if (max === 0) {
              return Sequence();
            } else if (max !== Infinity) {
              return ZeroOrMore(body, Comment("0 to " + max + " times"));
            } else {
              return ZeroOrMore(body);
            }
          }
          break;
        case 1:
          if (max === 1) {
            return Sequence(body);
          } else if (max !== Infinity) {
            return OneOrMore(body, Comment("1 to " + max + " times"));
          } else {
            return OneOrMore(body);
          }
          break;
        default:
          if (max === min) {
            return OneOrMore(body, Comment("" + max + " times"));
          } else if (max !== Infinity) {
            return OneOrMore(body, Comment("" + min + " to " + max + " times"));
          } else {
            return OneOrMore(body, Comment("at least " + min + " times"));
          }
      }
      break;
    case "capture-group": //Handles (...) blocks
      return Group(rx2rr(node.body), Comment("capture " + node.index));
    case "non-capture-group":
      return Group(rx2rr(node.body));
    case "positive-lookahead":
      return Group(rx2rr(node.body), Comment(node.type));
    case "negative-lookahead":
      return Group(rx2rr(node.body), Comment(node.type));
    case "positive-lookbehind":
      return Group(rx2rr(node.body), Comment(node.type));
    case "negative-lookbehind":
      return Group(rx2rr(node.body), Comment(node.type));
    case "back-reference":
      return NonTerminal("ref " + node.index);
    case "literal": //Handles individual characters
      if (node.escaped) {
        return Terminal(node.body);
      } else {
        return makeLiteral(node.body);
      }
      break;
    case "word":
      return NonTerminal("word-character");
    case "non-word":
      return NonTerminal("non-word-character");
    case "line-feed":
      return NonTerminal("LF");
    case "carriage-return":
      return NonTerminal("CR");
    case "form-feed":
      return NonTerminal("FF");
    case "back-space":
      return NonTerminal("BS");
    case "digit":
      return Terminal("0-9");
    case "white-space":
      return NonTerminal("WS");
    case "range":
      return Terminal(node.text);
    case "charset": //Handles [...] blocks
      var charNodes = node.body;
      var charset = [];
      for(var i = 0; i < charNodes.length; i++){
        if(charNodes[i].type === "range"){
          //Need to use text for these to display the whole range
          charset.push(charNodes[i].text);
        } else {
          charset.push(charNodes[i].body);
        }
      }

      if (charset.length === 1) {
        if (charset[0] === " ") {
          charset[0] = "SP";
        }
        if (node.invert) {
          return NonTerminal("not " + charset[0]);
        } else {
          return Terminal(charset[0]);
        }
      } else {
        //For multiple chars. Doesn't represent it as a choice block. Doesn't convert ending space to 'SP'
        var list = charset.slice(0, -1).join(", ");
        for (var i = 0; i < list.length; i++) {
          if (list[i] === " ") {
            list[i] = "SP";
          }
        }
        if (node.invert) {
          return NonTerminal("not " + list + " and " + charset.slice(-1));
        } else {
          return NonTerminal("" + list + " or " + charset.slice(-1));
        }
      }
      break;
    case "hex":
      return Terminal(node.text);
    case "octal":
      return Terminal(node.text);
    case "unicode":
      return Terminal(node.text);
    default:
      return NonTerminal(node.type);
  }
};

/*
* Parses the given regex using the regexp module
* regex: the regular expression to parse
* returns the entire regular expression tree (a bunch of nested objects)
*/
var parseRegex = function(regex) {
  if (regex instanceof RegExp) {
    regex = regex.source;
  }
  return parse(regex);
};

module.exports = {
  Regex2RailRoadDiagram: function(regex) {
    return Diagram(rx2rr(parseRegex(regex))).format();
  },
  ParseRegex: parseRegex
};

// THIS IS NOT THE RIGHT WAY TO DO THIS. WE SHOULD BE ASHAMED OF OURSELVES
window.Regex2RailRoadDiagramCopy = function(regex) {
  return Diagram(rx2rr(parseRegex(regex))).format();
}
