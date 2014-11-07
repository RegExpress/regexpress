var parseRegex, rx2rr;

var parse = require("regexp");

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

var makeLiteral = function(text) {
  var part, parts, sequence, _i, _len;
  if (text === " ") {
    return NonTerminal("SP");
  } else {
    parts = text.split(/(^ +| {2,}| +$)/);
    sequence = [];
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
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

rx2rr = function(node, options) {
  var alternatives, body, char, charset, i, list, literal, max, min, n, sequence, x, _i, _j, _len, _len1, _ref1, _ref2;
  switch (node.type) {
    case "match":
      literal = null;
      sequence = [];
      _ref1 = node.body;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        n = _ref1[_i];
        if (n.type === "literal" && !n.escaped) {
          if (literal != null) {
            literal += n.body;
          } else {
            literal = n.body;
          }
        } else {
          if (literal != null) {
            sequence.push(makeLiteral(literal));
            literal = null;
          }
          sequence.push(rx2rr(n, options));
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
    case "alternate":
      alternatives = [];
      while (node.type === "alternate") {
        alternatives.push(rx2rr(node.left, options));
        node = node.right;
      }
      alternatives.push(rx2rr(node, options));
      return new Choice(Math.floor(alternatives.length / 2) - 1, alternatives);
    case "quantified":
      _ref2 = node.quantifier, min = _ref2.min, max = _ref2.max;
      body = rx2rr(node.body, options);
      if (!(min <= max)) {
        throw new Error("Minimum quantifier (" + min + ") must be lower than ", +("maximum quantifier (" + max + ")"));
      }
      switch (min) {
        case 0:
          if (max === 1) {
            return Optional(body);
          } else {
            if (max === 0) {
              return ZeroOrMore(body, Comment("" + max + " times"));
            } else if (max !== Infinity) {
              return ZeroOrMore(body, Comment("0 to " + max + " times"));
            } else {
              return ZeroOrMore(body);
            }
          }
          break;
        case 1:
          if (max === 1) {
            return OneOrMore(body, Comment("once"));
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
    case "capture-group":
      return Group(rx2rr(node.body, options), Comment("capture " + node.index));
    case "non-capture-group":
      return Group(rx2rr(node.body, options));
    case "positive-lookahead":
    case "negative-lookahead":
    case "positive-lookbehind":
    case "negative-lookbehind":
      return Group(rx2rr(node.body, options), Comment(node.type));
    case "back-reference":
      return NonTerminal("ref " + node.index);
    case "literal":
      if (node.escaped) {
        return Terminal("\\" + node.body);
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
    case "charset":
      charset = (function() {
        var _j, _len1, _ref3, _results;
        _ref3 = node.body;
        _results = [];
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          x = _ref3[_j];
          _results.push(x.text);
        }
        return _results;
      })();
      if (charset.length === 1) {
        char = charset[0];
        if (char === " ") {
          char = "SP";
        }
        if (node.invert) {
          return NonTerminal("not " + charset[0]);
        } else {
          return Terminal(charset[0]);
        }
      } else {
        list = charset.slice(0, -1).join(", ");
        for (i = _j = 0, _len1 = list.length; _j < _len1; i = ++_j) {
          x = list[i];
          if (x === " ") {
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
    case "octal":
    case "unicode":
      return Terminal(node.text);
    default:
      return NonTerminal(node.type);
  }
};

parseRegex = function(regex) {
  if (regex instanceof RegExp) {
    regex = regex.source;
  }
  return parse(regex);
};

module.exports = {
  Regex2RailRoadDiagram: function(regex, parent, opts) {
    return Diagram(rx2rr(parseRegex(regex), opts)).addTo(parent);
  },
  ParseRegex: parseRegex
};
