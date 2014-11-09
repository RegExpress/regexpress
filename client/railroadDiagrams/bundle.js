(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
Railroad Diagrams
by Tab Atkins Jr. (and others)
http://xanthir.com
http://twitter.com/tabatkins
http://github.com/tabatkins/railroad-diagrams
This document and all associated files in the github project are licensed under CC0: http://creativecommons.org/publicdomain/zero/1.0/
This means you can reuse, remix, or otherwise appropriate this project for your own use WITHOUT RESTRICTION.
(The actual legal meaning can be found at the above link.)
Don't ask me for permission to use any part of this project, JUST USE IT.
I would appreciate attribution, but that is not required by the license.
*/

/*
This file uses a module pattern to avoid leaking names into the global scope.
The only accidental leakage is the name "temp".
The exported names can be found at the bottom of this file;
simply change the names in the array of strings to change what they are called in your application.
As well, several configuration constants are passed into the module function at the bottom of this file.
At runtime, these constants can be found on the Diagram class.
*/

var options = {
    VERTICAL_SEPARATION: 8,
    ARC_RADIUS: 10,
    DIAGRAM_CLASS: 'railroad-diagram',
    STROKE_ODD_PIXEL_LENGTH: true,
    INTERNAL_ALIGNMENT: 'center',
}

  function subclassOf(baseClass, superClass) {
    baseClass.prototype = Object.create(superClass.prototype);
    baseClass.prototype.$super = superClass.prototype;
  }

  function unnull(/* children */) {
    return [].slice.call(arguments).reduce(function(sofar, x) { return sofar !== undefined ? sofar : x; });
  }

  function determineGaps(outer, inner) {
    var diff = outer - inner;
    switch(Diagram.INTERNAL_ALIGNMENT) {
      case 'left': return [0, diff]; break;
      case 'right': return [diff, 0]; break;
      case 'center':
      default: return [diff/2, diff/2]; break;
    }
  }

  function wrapString(value) {
    return ((typeof value) == 'string') ? new Terminal(value) : value;
  }


  function SVG(name, attrs, text) {
    attrs = attrs || {};
    text = text || '';
    var el = document.createElementNS("http://www.w3.org/2000/svg",name);
    for(var attr in attrs) {
      el.setAttribute(attr, attrs[attr]);
    }
    el.textContent = text;
    return el;
  }

  function FakeSVG(tagName, attrs, text){
    if(!(this instanceof FakeSVG)) return new FakeSVG(tagName, attrs, text);
    if(text) this.children = text;
    else this.children = [];
    this.tagName = tagName;
    this.attrs = unnull(attrs, {});

    return this;
  };
  FakeSVG.prototype.format = function(x, y, width) {
    // Virtual
  };
  FakeSVG.prototype.addTo = function(parent) {
    if(parent instanceof FakeSVG) {
      parent.children.push(this);
      return this;
    } else {
      var svg = this.toSVG();
      parent.appendChild(svg);
      return svg;
    }
  };
  FakeSVG.prototype.toSVG = function() {
    var el = SVG(this.tagName, this.attrs);
    if(typeof this.children == 'string') {
      el.textContent = this.children;
    } else {
      this.children.forEach(function(e) {
        el.appendChild(e.toSVG());
      });
    }
    return el;
  };
  FakeSVG.prototype.toString = function() {
    var str = '<' + this.tagName;
    var group = this.tagName == "g" || this.tagName == "svg";
    for(var attr in this.attrs) {
      str += ' ' + attr + '="' + (this.attrs[attr]+'').replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
    }
    str += '>';
    if(group) str += "\n";
    if(typeof this.children == 'string') {
      str += this.children.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    } else {
      this.children.forEach(function(e) {
        str += e;
      });
    }
    str += '</' + this.tagName + '>\n';
    return str;
  }

  function Path(x,y) {
    if(!(this instanceof Path)) return new Path(x,y);
    FakeSVG.call(this, 'path');
    this.attrs.d = "M"+x+' '+y;
  }
  subclassOf(Path, FakeSVG);
  Path.prototype.m = function(x,y) {
    this.attrs.d += 'm'+x+' '+y;
    return this;
  }
  Path.prototype.h = function(val) {
    this.attrs.d += 'h'+val;
    return this;
  }
  Path.prototype.right = Path.prototype.h;
  Path.prototype.left = function(val) { return this.h(-val); }
  Path.prototype.v = function(val) {
    this.attrs.d += 'v'+val;
    return this;
  }
  Path.prototype.down = Path.prototype.v;
  Path.prototype.up = function(val) { return this.v(-val); }
  Path.prototype.arc = function(sweep){
    var x = Diagram.ARC_RADIUS;
    var y = Diagram.ARC_RADIUS;
    if(sweep[0] == 'e' || sweep[1] == 'w') {
      x *= -1;
    }
    if(sweep[0] == 's' || sweep[1] == 'n') {
      y *= -1;
    }
    if(sweep == 'ne' || sweep == 'es' || sweep == 'sw' || sweep == 'wn') {
      var cw = 1;
    } else {
      var cw = 0;
    }
    this.attrs.d += "a"+Diagram.ARC_RADIUS+" "+Diagram.ARC_RADIUS+" 0 0 "+cw+' '+x+' '+y;
    return this;
  }
  Path.prototype.format = function() {
    // All paths in this library start/end horizontally.
    // The extra .5 ensures a minor overlap, so there's no seams in bad rasterizers.
    this.attrs.d += 'h.5';
    return this;
  }

  function Diagram(items) {
    if(!(this instanceof Diagram)) return new Diagram([].slice.call(arguments));
    FakeSVG.call(this, 'svg', {class: Diagram.DIAGRAM_CLASS});
    this.items = items.map(wrapString);
    this.items.unshift(new Start);
    this.items.push(new End);
    this.width = this.items.reduce(function(sofar, el) { return sofar + el.width + (el.needsSpace?20:0)}, 0)+1;
    this.up = Math.max.apply(null, this.items.map(function (x) { return x.up; }));
    this.down = Math.max.apply(null, this.items.map(function (x) { return x.down; }));
    this.formatted = false;
  }
  subclassOf(Diagram, FakeSVG);
  for(var option in options) {
    Diagram[option] = options[option];
  }
  Diagram.prototype.format = function(paddingt, paddingr, paddingb, paddingl) {
    paddingt = unnull(paddingt, 20);
    paddingr = unnull(paddingr, paddingt, 20);
    paddingb = unnull(paddingb, paddingt, 20);
    paddingl = unnull(paddingl, paddingr, 20);
    var x = paddingl;
    var y = paddingt;
    y += this.up;
    var g = FakeSVG('g', Diagram.STROKE_ODD_PIXEL_LENGTH ? {transform:'translate(.5 .5)'} : {});
    for(var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if(item.needsSpace) {
        Path(x,y).h(10).addTo(g);
        x += 10;
      }
      item.format(x, y, item.width).addTo(g);
      x += item.width;
      if(item.needsSpace) {
        Path(x,y).h(10).addTo(g);
        x += 10;
      }
    }
    this.attrs.width = this.width + paddingl + paddingr;
    this.attrs.height = this.up + this.down + paddingt + paddingb;
    this.attrs.viewBox = "0 0 "  + this.attrs.width + " " + this.attrs.height;
    g.addTo(this);
    this.formatted = true;
    return this;
  }
  Diagram.prototype.addTo = function(parent) {
    var scriptTag = document.getElementsByTagName('script');
    scriptTag = scriptTag[scriptTag.length - 1];
    var parentTag = scriptTag.parentNode;
    parent = parent || parentTag;
    return this.$super.addTo.call(this, parent);
  }
  Diagram.prototype.toSVG = function() {
    if (!this.formatted) {
      this.format();
    }
    return this.$super.toSVG.call(this);
  }
  Diagram.prototype.toString = function() {
    if (!this.formatted) {
      this.format();
    }
    return this.$super.toString.call(this);
  }

  function Sequence(items) {
    if(!(this instanceof Sequence)) return new Sequence([].slice.call(arguments));
    FakeSVG.call(this, 'g');
    this.items = items.map(wrapString);
    this.width = this.items.reduce(function(sofar, el) { return sofar + el.width + (el.needsSpace?20:0)}, 0);
    this.up = this.items.reduce(function(sofar,el) { return Math.max(sofar, el.up)}, 0);
    this.down = this.items.reduce(function(sofar,el) { return Math.max(sofar, el.down)}, 0);
  }
  subclassOf(Sequence, FakeSVG);
  Sequence.prototype.format = function(x,y,width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    for(var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if(item.needsSpace) {
        Path(x,y).h(10).addTo(this);
        x += 10;
      }
      item.format(x, y, item.width).addTo(this);
      x += item.width;
      if(item.needsSpace) {
        Path(x,y).h(10).addTo(this);
        x += 10;
      }
    }
    return this;
  }

  function Choice(normal, items) {
    if(!(this instanceof Choice)) return new Choice(normal, [].slice.call(arguments,1));
    FakeSVG.call(this, 'g');
    if( typeof normal !== "number" || normal !== Math.floor(normal) ) {
      throw new TypeError("The first argument of Choice() must be an integer.");
    } else if(normal < 0 || normal >= items.length) {
      throw new RangeError("The first argument of Choice() must be an index for one of the items.");
    } else {
      this.normal = normal;
    }
    this.items = items.map(wrapString);
    this.width = this.items.reduce(function(sofar, el){return Math.max(sofar, el.width)},0) + Diagram.ARC_RADIUS*4;
    this.up = this.down = 0;
    for(var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if(i < normal) { this.up += Math.max(Diagram.ARC_RADIUS,item.up + item.down + Diagram.VERTICAL_SEPARATION); }
      if(i == normal) { this.up += Math.max(Diagram.ARC_RADIUS, item.up); this.down += Math.max(Diagram.ARC_RADIUS, item.down); }
      if(i > normal) { this.down += Math.max(Diagram.ARC_RADIUS,Diagram.VERTICAL_SEPARATION + item.up + item.down); }
    }
  }
  subclassOf(Choice, FakeSVG);
  Choice.prototype.format = function(x,y,width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    var last = this.items.length -1;
    var innerWidth = this.width - Diagram.ARC_RADIUS*4;

    // Do the elements that curve above
    for(var i = this.normal - 1; i >= 0; i--) {
      var item = this.items[i];
      if( i == this.normal - 1 ) {
        var distanceFromY = Math.max(Diagram.ARC_RADIUS*2, this.items[i+1].up + Diagram.VERTICAL_SEPARATION + item.down);
      }
      Path(x,y).arc('se').up(distanceFromY - Diagram.ARC_RADIUS*2).arc('wn').addTo(this);
      item.format(x+Diagram.ARC_RADIUS*2,y - distanceFromY,innerWidth).addTo(this);
      Path(x+Diagram.ARC_RADIUS*2+innerWidth, y-distanceFromY).arc('ne').down(distanceFromY - Diagram.ARC_RADIUS*2).arc('ws').addTo(this);
      distanceFromY += Math.max(Diagram.ARC_RADIUS, item.up + Diagram.VERTICAL_SEPARATION + (i == 0 ? 0 : this.items[i-1].down));
    }

    // Do the straight-line path.
    Path(x,y).right(Diagram.ARC_RADIUS*2).addTo(this);
    this.items[this.normal].format(x+Diagram.ARC_RADIUS*2, y, innerWidth).addTo(this);
    Path(x+Diagram.ARC_RADIUS*2+innerWidth, y).right(Diagram.ARC_RADIUS*2).addTo(this);

    // Do the elements that curve below
    for(var i = this.normal+1; i <= last; i++) {
      var item = this.items[i];
      if( i == this.normal + 1 ) {
        var distanceFromY = Math.max(Diagram.ARC_RADIUS*2, this.items[i-1].down + Diagram.VERTICAL_SEPARATION + item.up);
      }
      Path(x,y).arc('ne').down(distanceFromY - Diagram.ARC_RADIUS*2).arc('ws').addTo(this);
      item.format(x+Diagram.ARC_RADIUS*2, y+distanceFromY, innerWidth).addTo(this);
      Path(x+Diagram.ARC_RADIUS*2+innerWidth, y+distanceFromY).arc('se').up(distanceFromY - Diagram.ARC_RADIUS*2).arc('wn').addTo(this);
      distanceFromY += Math.max(Diagram.ARC_RADIUS, item.down + Diagram.VERTICAL_SEPARATION + (i == last ? 0 : this.items[i+1].up));
    }

    return this;
  }

  function Optional(item, skip) {
    if( skip === undefined )
      return Choice(1, Skip(), item);
    else if ( skip === "skip" )
      return Choice(0, Skip(), item);
    else
      throw "Unknown value for Optional()'s 'skip' argument.";
  }

  function Group(item, caption) {
    if(!(this instanceof Group)) return new Group(item, caption);
    FakeSVG.call(this, 'g');
    caption = caption || (new Skip);
    this.item = wrapString(item);
    this.caption = caption;
    this.width = this.item.width;
    var height = this.item.up + this.item.down;
    if (caption)
    {
      height += Diagram.VERTICAL_SEPARATION+this.caption.up + this.caption.down;
    }

    this.up = this.item.up + 5;
    this.down = height-this.up + 5;
  }
  subclassOf(Group, FakeSVG);
  Group.prototype.needsSpace = true;
  Group.prototype.format = function(x, y, width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    FakeSVG('rect', {
      x:x, y:y-this.up,
      width:this.width, height:this.up+this.down, "class": "group"}).addTo(this);

    this.item.format(x, y, this.width).addTo(this);

    if (this.caption) {
      var caption_y = y+this.item.down+Diagram.VERTICAL_SEPARATION+this.caption.up - 5;
      var caption_x = x + (this.width - this.caption.width)/2;
      this.caption.format(caption_x, caption_y, this.caption.width).addTo(this);
    }

    // FakeSVG('text', {x:x+this.width/2, y:y+4}, this.text).addTo(this);
    return this;
  }

  function OneOrMore(item, rep) {
    if(!(this instanceof OneOrMore)) return new OneOrMore(item, rep);
    FakeSVG.call(this, 'g');
    rep = rep || (new Skip);
    this.item = wrapString(item);
    this.rep = wrapString(rep);
    this.width = Math.max(this.item.width, this.rep.width) + Diagram.ARC_RADIUS*2;
    this.up = this.item.up;
    this.down = Math.max(Diagram.ARC_RADIUS*2, this.item.down + Diagram.VERTICAL_SEPARATION + this.rep.up + this.rep.down);
  }
  subclassOf(OneOrMore, FakeSVG);
  OneOrMore.prototype.needsSpace = true;
  OneOrMore.prototype.format = function(x,y,width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    // Draw item
    Path(x,y).right(Diagram.ARC_RADIUS).addTo(this);
    this.item.format(x+Diagram.ARC_RADIUS,y,this.width-Diagram.ARC_RADIUS*2).addTo(this);
    Path(x+this.width-Diagram.ARC_RADIUS,y).right(Diagram.ARC_RADIUS).addTo(this);

    // Draw repeat arc
    var distanceFromY = Math.max(Diagram.ARC_RADIUS*2, this.item.down+Diagram.VERTICAL_SEPARATION+this.rep.up);
    Path(x+Diagram.ARC_RADIUS,y).arc('nw').down(distanceFromY-Diagram.ARC_RADIUS*2).arc('ws').addTo(this);
    this.rep.format(x+Diagram.ARC_RADIUS, y+distanceFromY, this.width - Diagram.ARC_RADIUS*2).addTo(this);
    Path(x+this.width-Diagram.ARC_RADIUS, y+distanceFromY).arc('se').up(distanceFromY-Diagram.ARC_RADIUS*2).arc('en').addTo(this);

    return this;
  }

  function ZeroOrMore(item, rep, skip) {
    return Optional(OneOrMore(item, rep), skip);
  }

  function Start() {
    if(!(this instanceof Start)) return new Start();
    FakeSVG.call(this, 'path');
    this.width = 20;
    this.up = 10;
    this.down = 10;
  }
  subclassOf(Start, FakeSVG);
  Start.prototype.format = function(x,y) {
    this.attrs.d = 'M '+x+' '+(y-10)+' v 20 m 10 -20 v 20 m -10 -10 h 20.5';
    return this;
  }

  function End() {
    if(!(this instanceof End)) return new End();
    FakeSVG.call(this, 'path');
    this.width = 20;
    this.up = 10;
    this.down = 10;
  }
  subclassOf(End, FakeSVG);
  End.prototype.format = function(x,y) {
    this.attrs.d = 'M '+x+' '+y+' h 20 m -10 -10 v 20 m 10 -20 v 20';
    return this;
  }

  function Terminal(text) {
    if(!(this instanceof Terminal)) return new Terminal(text);
    FakeSVG.call(this, 'g');
    this.text = text;
    this.width = text.length * 8 + 20; /* Assume that each char is .5em, and that the em is 16px */
    this.up = 11;
    this.down = 11;
  }
  subclassOf(Terminal, FakeSVG);
  Terminal.prototype.needsSpace = true;
  Terminal.prototype.format = function(x, y, width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    FakeSVG('rect', {x:x, y:y-11, width:this.width, height:this.up+this.down, rx:10, ry:10}).addTo(this);
    FakeSVG('text', {x:x+this.width/2, y:y+4}, this.text).addTo(this);
    return this;
  }

  function NonTerminal(text) {
    if(!(this instanceof NonTerminal)) return new NonTerminal(text);
    FakeSVG.call(this, 'g');
    this.text = text;
    this.width = text.length * 8 + 20;
    this.up = 11;
    this.down = 11;
  }
  subclassOf(NonTerminal, FakeSVG);
  NonTerminal.prototype.needsSpace = true;
  NonTerminal.prototype.format = function(x, y, width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    FakeSVG('rect', {x:x, y:y-11, width:this.width, height:this.up+this.down}).addTo(this);
    FakeSVG('text', {x:x+this.width/2, y:y+4}, this.text).addTo(this);
    return this;
  }

  function Comment(text) {
    if(!(this instanceof Comment)) return new Comment(text);
    FakeSVG.call(this, 'g');
    this.text = text;
    this.width = text.length * 7 + 10;
    this.up = 11;
    this.down = 11;
  }
  subclassOf(Comment, FakeSVG);
  Comment.prototype.needsSpace = true;
  Comment.prototype.format = function(x, y, width) {
    // Hook up the two sides if this is narrower than its stated width.
    var gaps = determineGaps(width, this.width);
    Path(x,y).h(gaps[0]).addTo(this);
    Path(x+gaps[0]+this.width,y).h(gaps[1]).addTo(this);
    x += gaps[0];

    FakeSVG('text', {x:x+this.width/2, y:y+5, class:'comment'}, this.text).addTo(this);
    return this;
  }

  function Skip() {
    if(!(this instanceof Skip)) return new Skip();
    FakeSVG.call(this, 'g');
    this.width = 0;
    this.up = 0;
    this.down = 0;
  }
  subclassOf(Skip, FakeSVG);
  Skip.prototype.format = function(x, y, width) {
    Path(x,y).right(width).addTo(this);
    return this;
  }

module.exports = {
  "Diagram": Diagram,
  "Sequence": Sequence,
  "Choice": Choice,
  "Optional": Optional,
  "OneOrMore": OneOrMore,
  "ZeroOrMore": ZeroOrMore,
  "Terminal": Terminal,
  "NonTerminal": NonTerminal,
  "Comment": Comment,
  "Group": Group,
  "Skip": Skip
};

/*
These are the names that the internal classes are exported as.
If you would like different names, adjust them here.
*/
//['Diagram', 'Sequence', 'Choice', 'Optional', 'OneOrMore', 'ZeroOrMore', 'Terminal', 'NonTerminal', 'Comment', 'Skip']
//  .forEach(function(e,i) { window[e] = temp[i]; });

},{}],2:[function(require,module,exports){
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

window.Regex2RailRoadDiagramCopy = function(regex) {
  return Diagram(rx2rr(parseRegex(regex))).format();
}

},{"./railroad-diagrams":1,"regexp":3}],3:[function(require,module,exports){
function parse(n) {
  if ("string" != typeof n) {
    var t = new TypeError("The regexp to parse must be represented as a string.");
    throw t;
  }
  return index = 1, cgs = {}, parser.parse(n);
}

function Token(n) {
  this.type = n, this.offset = Token.offset(), this.text = Token.text();
}

function Alternate(n, t) {
  Token.call(this, "alternate"), this.left = n, this.right = t;
}

function Match(n) {
  Token.call(this, "match"), this.body = n.filter(Boolean);
}

function Group(n, t) {
  Token.call(this, n), this.body = t;
}

function CaptureGroup(n) {
  Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++), 
  this.body = n;
}

function Quantified(n, t) {
  Token.call(this, "quantified"), this.body = n, this.quantifier = t;
}

function Quantifier(n, t) {
  Token.call(this, "quantifier"), this.min = n, this.max = t, this.greedy = !0;
}

function CharSet(n, t) {
  Token.call(this, "charset"), this.invert = n, this.body = t;
}

function CharacterRange(n, t) {
  Token.call(this, "range"), this.start = n, this.end = t;
}

function Literal(n) {
  Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
}

function Unicode(n) {
  Token.call(this, "unicode"), this.code = n.toUpperCase();
}

function Hex(n) {
  Token.call(this, "hex"), this.code = n.toUpperCase();
}

function Octal(n) {
  Token.call(this, "octal"), this.code = n.toUpperCase();
}

function BackReference(n) {
  Token.call(this, "back-reference"), this.code = n.toUpperCase();
}

function ControlCharacter(n) {
  Token.call(this, "control-character"), this.code = n.toUpperCase();
}

var parser = function() {
  function n(n, t) {
    function r() {
      this.constructor = n;
    }
    r.prototype = t.prototype, n.prototype = new r();
  }
  function t(n, t, r, e, l) {
    function u(n, t) {
      function r(n) {
        function t(n) {
          return n.charCodeAt(0).toString(16).toUpperCase();
        }
        return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n) {
          return "\\x0" + t(n);
        }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n) {
          return "\\x" + t(n);
        }).replace(/[\u0180-\u0FFF]/g, function(n) {
          return "\\u0" + t(n);
        }).replace(/[\u1080-\uFFFF]/g, function(n) {
          return "\\u" + t(n);
        });
      }
      var e, l;
      switch (n.length) {
       case 0:
        e = "end of input";
        break;

       case 1:
        e = n[0];
        break;

       default:
        e = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
      }
      return l = t ? '"' + r(t) + '"' : "end of input", "Expected " + e + " but " + l + " found.";
    }
    this.expected = n, this.found = t, this.offset = r, this.line = e, this.column = l, 
    this.name = "SyntaxError", this.message = u(n, t);
  }
  function r(n) {
    function r() {
      return n.substring(Ee, Me);
    }
    function e() {
      return Ee;
    }
    function l(t) {
      function r(t, r, e) {
        var l, u;
        for (l = r; e > l; l++) u = n.charAt(l), "\n" === u ? (t.seenCR || t.line++, t.column = 1, 
        t.seenCR = !1) : "\r" === u || "\u2028" === u || "\u2029" === u ? (t.line++, t.column = 1, 
        t.seenCR = !0) : (t.column++, t.seenCR = !1);
      }
      return He !== t && (He > t && (He = 0, $e = {
        line: 1,
        column: 1,
        seenCR: !1
      }), r($e, He, t), He = t), $e;
    }
    function u(n) {
      qe > Me || (Me > qe && (qe = Me, De = []), De.push(n));
    }
    function o(n) {
      var t = 0;
      for (n.sort(); t < n.length; ) n[t - 1] === n[t] ? n.splice(t, 1) : t++;
    }
    function c() {
      var t, r, e, l, o;
      return t = Me, r = a(), null !== r ? (e = Me, 124 === n.charCodeAt(Me) ? (l = st, 
      Me++) : (l = null, 0 === We && u(ft)), null !== l ? (o = c(), null !== o ? (l = [ l, o ], 
      e = l) : (Me = e, e = at)) : (Me = e, e = at), null === e && (e = it), null !== e ? (Ee = t, 
      r = pt(r, e), null === r ? (Me = t, t = r) : t = r) : (Me = t, t = at)) : (Me = t, 
      t = at), t;
    }
    function a() {
      var n, t, r, e, l;
      if (n = Me, t = s(), null === t && (t = it), null !== t) if (r = Me, We++, e = h(), 
      We--, null === e ? r = it : (Me = r, r = at), null !== r) {
        for (e = [], l = p(), null === l && (l = i()); null !== l; ) e.push(l), l = p(), 
        null === l && (l = i());
        null !== e ? (l = f(), null === l && (l = it), null !== l ? (Ee = n, t = ht(t, e, l), 
        null === t ? (Me = n, n = t) : n = t) : (Me = n, n = at)) : (Me = n, n = at);
      } else Me = n, n = at; else Me = n, n = at;
      return n;
    }
    function i() {
      var n;
      return n = T(), null === n && (n = j(), null === n && (n = U())), n;
    }
    function s() {
      var t, r;
      return t = Me, 94 === n.charCodeAt(Me) ? (r = dt, Me++) : (r = null, 0 === We && u(Ct)), 
      null !== r && (Ee = t, r = kt()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function f() {
      var t, r;
      return t = Me, 36 === n.charCodeAt(Me) ? (r = vt, Me++) : (r = null, 0 === We && u(yt)), 
      null !== r && (Ee = t, r = bt()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function p() {
      var n, t, r;
      return n = Me, t = i(), null !== t ? (r = h(), null !== r ? (Ee = n, t = At(t, r), 
      null === t ? (Me = n, n = t) : n = t) : (Me = n, n = at)) : (Me = n, n = at), n;
    }
    function h() {
      var n, t, r;
      return We++, n = Me, t = d(), null !== t ? (r = w(), null === r && (r = it), null !== r ? (Ee = n, 
      t = xt(t, r), null === t ? (Me = n, n = t) : n = t) : (Me = n, n = at)) : (Me = n, 
      n = at), We--, null === n && (t = null, 0 === We && u(wt)), n;
    }
    function d() {
      var n;
      return n = C(), null === n && (n = k(), null === n && (n = v(), null === n && (n = y(), 
      null === n && (n = b(), null === n && (n = A()))))), n;
    }
    function C() {
      var t, r, e, l, o, c;
      return t = Me, 123 === n.charCodeAt(Me) ? (r = Tt, Me++) : (r = null, 0 === We && u(gt)), 
      null !== r ? (e = x(), null !== e ? (44 === n.charCodeAt(Me) ? (l = Rt, Me++) : (l = null, 
      0 === We && u(Ot)), null !== l ? (o = x(), null !== o ? (125 === n.charCodeAt(Me) ? (c = Qt, 
      Me++) : (c = null, 0 === We && u(jt)), null !== c ? (Ee = t, r = mt(e, o), null === r ? (Me = t, 
      t = r) : t = r) : (Me = t, t = at)) : (Me = t, t = at)) : (Me = t, t = at)) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    function k() {
      var t, r, e, l;
      return t = Me, 123 === n.charCodeAt(Me) ? (r = Tt, Me++) : (r = null, 0 === We && u(gt)), 
      null !== r ? (e = x(), null !== e ? (n.substr(Me, 2) === Gt ? (l = Gt, Me += 2) : (l = null, 
      0 === We && u(Ft)), null !== l ? (Ee = t, r = St(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at)) : (Me = t, t = at), t;
    }
    function v() {
      var t, r, e, l;
      return t = Me, 123 === n.charCodeAt(Me) ? (r = Tt, Me++) : (r = null, 0 === We && u(gt)), 
      null !== r ? (e = x(), null !== e ? (125 === n.charCodeAt(Me) ? (l = Qt, Me++) : (l = null, 
      0 === We && u(jt)), null !== l ? (Ee = t, r = Ut(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at)) : (Me = t, t = at), t;
    }
    function y() {
      var t, r;
      return t = Me, 43 === n.charCodeAt(Me) ? (r = Bt, Me++) : (r = null, 0 === We && u(Lt)), 
      null !== r && (Ee = t, r = Mt()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function b() {
      var t, r;
      return t = Me, 42 === n.charCodeAt(Me) ? (r = Et, Me++) : (r = null, 0 === We && u(Ht)), 
      null !== r && (Ee = t, r = $t()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function A() {
      var t, r;
      return t = Me, 63 === n.charCodeAt(Me) ? (r = qt, Me++) : (r = null, 0 === We && u(Dt)), 
      null !== r && (Ee = t, r = Wt()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function w() {
      var t;
      return 63 === n.charCodeAt(Me) ? (t = qt, Me++) : (t = null, 0 === We && u(Dt)), 
      t;
    }
    function x() {
      var t, r, e;
      if (t = Me, r = [], zt.test(n.charAt(Me)) ? (e = n.charAt(Me), Me++) : (e = null, 
      0 === We && u(It)), null !== e) for (;null !== e; ) r.push(e), zt.test(n.charAt(Me)) ? (e = n.charAt(Me), 
      Me++) : (e = null, 0 === We && u(It)); else r = at;
      return null !== r && (Ee = t, r = Jt(r)), null === r ? (Me = t, t = r) : t = r, 
      t;
    }
    function T() {
      var t, r, e, l;
      return t = Me, 40 === n.charCodeAt(Me) ? (r = Kt, Me++) : (r = null, 0 === We && u(Nt)), 
      null !== r ? (e = O(), null === e && (e = Q(), null === e && (e = R(), null === e && (e = g()))), 
      null !== e ? (41 === n.charCodeAt(Me) ? (l = Pt, Me++) : (l = null, 0 === We && u(Vt)), 
      null !== l ? (Ee = t, r = Xt(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at)) : (Me = t, t = at), t;
    }
    function g() {
      var n, t;
      return n = Me, t = c(), null !== t && (Ee = n, t = Yt(t)), null === t ? (Me = n, 
      n = t) : n = t, n;
    }
    function R() {
      var t, r, e;
      return t = Me, n.substr(Me, 2) === Zt ? (r = Zt, Me += 2) : (r = null, 0 === We && u(_t)), 
      null !== r ? (e = c(), null !== e ? (Ee = t, r = nr(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    function O() {
      var t, r, e;
      return t = Me, n.substr(Me, 2) === tr ? (r = tr, Me += 2) : (r = null, 0 === We && u(rr)), 
      null !== r ? (e = c(), null !== e ? (Ee = t, r = er(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    function Q() {
      var t, r, e;
      return t = Me, n.substr(Me, 2) === lr ? (r = lr, Me += 2) : (r = null, 0 === We && u(ur)), 
      null !== r ? (e = c(), null !== e ? (Ee = t, r = or(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    function j() {
      var t, r, e, l, o;
      if (We++, t = Me, 91 === n.charCodeAt(Me) ? (r = ar, Me++) : (r = null, 0 === We && u(ir)), 
      null !== r) if (94 === n.charCodeAt(Me) ? (e = dt, Me++) : (e = null, 0 === We && u(Ct)), 
      null === e && (e = it), null !== e) {
        for (l = [], o = m(), null === o && (o = G()); null !== o; ) l.push(o), o = m(), 
        null === o && (o = G());
        null !== l ? (93 === n.charCodeAt(Me) ? (o = sr, Me++) : (o = null, 0 === We && u(fr)), 
        null !== o ? (Ee = t, r = pr(e, l), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
        t = at)) : (Me = t, t = at);
      } else Me = t, t = at; else Me = t, t = at;
      return We--, null === t && (r = null, 0 === We && u(cr)), t;
    }
    function m() {
      var t, r, e, l;
      return We++, t = Me, r = G(), null !== r ? (45 === n.charCodeAt(Me) ? (e = dr, Me++) : (e = null, 
      0 === We && u(Cr)), null !== e ? (l = G(), null !== l ? (Ee = t, r = kr(r, l), null === r ? (Me = t, 
      t = r) : t = r) : (Me = t, t = at)) : (Me = t, t = at)) : (Me = t, t = at), We--, 
      null === t && (r = null, 0 === We && u(hr)), t;
    }
    function G() {
      var n, t;
      return We++, n = S(), null === n && (n = F()), We--, null === n && (t = null, 0 === We && u(vr)), 
      n;
    }
    function F() {
      var t, r;
      return t = Me, yr.test(n.charAt(Me)) ? (r = n.charAt(Me), Me++) : (r = null, 0 === We && u(br)), 
      null !== r && (Ee = t, r = Ar(r)), null === r ? (Me = t, t = r) : t = r, t;
    }
    function S() {
      var n;
      return n = E(), null === n && (n = Y(), null === n && (n = q(), null === n && (n = D(), 
      null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), 
      null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), 
      null === n && (n = X(), null === n && (n = _(), null === n && (n = nt(), null === n && (n = tt(), 
      null === n && (n = rt(), null === n && (n = et()))))))))))))))))), n;
    }
    function U() {
      var n;
      return n = B(), null === n && (n = M(), null === n && (n = L())), n;
    }
    function B() {
      var t, r;
      return t = Me, 46 === n.charCodeAt(Me) ? (r = wr, Me++) : (r = null, 0 === We && u(xr)), 
      null !== r && (Ee = t, r = Tr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function L() {
      var t, r;
      return We++, t = Me, Rr.test(n.charAt(Me)) ? (r = n.charAt(Me), Me++) : (r = null, 
      0 === We && u(Or)), null !== r && (Ee = t, r = Ar(r)), null === r ? (Me = t, t = r) : t = r, 
      We--, null === t && (r = null, 0 === We && u(gr)), t;
    }
    function M() {
      var n;
      return n = H(), null === n && (n = $(), null === n && (n = Y(), null === n && (n = q(), 
      null === n && (n = D(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), 
      null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), 
      null === n && (n = V(), null === n && (n = X(), null === n && (n = Z(), null === n && (n = _(), 
      null === n && (n = nt(), null === n && (n = tt(), null === n && (n = rt(), null === n && (n = et()))))))))))))))))))), 
      n;
    }
    function E() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Qr ? (r = Qr, Me += 2) : (r = null, 0 === We && u(jr)), 
      null !== r && (Ee = t, r = mr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function H() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Qr ? (r = Qr, Me += 2) : (r = null, 0 === We && u(jr)), 
      null !== r && (Ee = t, r = Gr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function $() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Fr ? (r = Fr, Me += 2) : (r = null, 0 === We && u(Sr)), 
      null !== r && (Ee = t, r = Ur()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function q() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Br ? (r = Br, Me += 2) : (r = null, 0 === We && u(Lr)), 
      null !== r && (Ee = t, r = Mr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function D() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Er ? (r = Er, Me += 2) : (r = null, 0 === We && u(Hr)), 
      null !== r && (Ee = t, r = $r()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function W() {
      var t, r;
      return t = Me, n.substr(Me, 2) === qr ? (r = qr, Me += 2) : (r = null, 0 === We && u(Dr)), 
      null !== r && (Ee = t, r = Wr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function z() {
      var t, r;
      return t = Me, n.substr(Me, 2) === zr ? (r = zr, Me += 2) : (r = null, 0 === We && u(Ir)), 
      null !== r && (Ee = t, r = Jr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function I() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Kr ? (r = Kr, Me += 2) : (r = null, 0 === We && u(Nr)), 
      null !== r && (Ee = t, r = Pr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function J() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Vr ? (r = Vr, Me += 2) : (r = null, 0 === We && u(Xr)), 
      null !== r && (Ee = t, r = Yr()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function K() {
      var t, r;
      return t = Me, n.substr(Me, 2) === Zr ? (r = Zr, Me += 2) : (r = null, 0 === We && u(_r)), 
      null !== r && (Ee = t, r = ne()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function N() {
      var t, r;
      return t = Me, n.substr(Me, 2) === te ? (r = te, Me += 2) : (r = null, 0 === We && u(re)), 
      null !== r && (Ee = t, r = ee()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function P() {
      var t, r;
      return t = Me, n.substr(Me, 2) === le ? (r = le, Me += 2) : (r = null, 0 === We && u(ue)), 
      null !== r && (Ee = t, r = oe()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function V() {
      var t, r;
      return t = Me, n.substr(Me, 2) === ce ? (r = ce, Me += 2) : (r = null, 0 === We && u(ae)), 
      null !== r && (Ee = t, r = ie()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function X() {
      var t, r;
      return t = Me, n.substr(Me, 2) === se ? (r = se, Me += 2) : (r = null, 0 === We && u(fe)), 
      null !== r && (Ee = t, r = pe()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function Y() {
      var t, r, e;
      return t = Me, n.substr(Me, 2) === he ? (r = he, Me += 2) : (r = null, 0 === We && u(de)), 
      null !== r ? (n.length > Me ? (e = n.charAt(Me), Me++) : (e = null, 0 === We && u(Ce)), 
      null !== e ? (Ee = t, r = ke(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    function Z() {
      var t, r, e;
      return t = Me, 92 === n.charCodeAt(Me) ? (r = ve, Me++) : (r = null, 0 === We && u(ye)), 
      null !== r ? (be.test(n.charAt(Me)) ? (e = n.charAt(Me), Me++) : (e = null, 0 === We && u(Ae)), 
      null !== e ? (Ee = t, r = we(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    function _() {
      var t, r, e, l;
      if (t = Me, n.substr(Me, 2) === xe ? (r = xe, Me += 2) : (r = null, 0 === We && u(Te)), 
      null !== r) {
        if (e = [], ge.test(n.charAt(Me)) ? (l = n.charAt(Me), Me++) : (l = null, 0 === We && u(Re)), 
        null !== l) for (;null !== l; ) e.push(l), ge.test(n.charAt(Me)) ? (l = n.charAt(Me), 
        Me++) : (l = null, 0 === We && u(Re)); else e = at;
        null !== e ? (Ee = t, r = Oe(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
        t = at);
      } else Me = t, t = at;
      return t;
    }
    function nt() {
      var t, r, e, l;
      if (t = Me, n.substr(Me, 2) === Qe ? (r = Qe, Me += 2) : (r = null, 0 === We && u(je)), 
      null !== r) {
        if (e = [], me.test(n.charAt(Me)) ? (l = n.charAt(Me), Me++) : (l = null, 0 === We && u(Ge)), 
        null !== l) for (;null !== l; ) e.push(l), me.test(n.charAt(Me)) ? (l = n.charAt(Me), 
        Me++) : (l = null, 0 === We && u(Ge)); else e = at;
        null !== e ? (Ee = t, r = Fe(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
        t = at);
      } else Me = t, t = at;
      return t;
    }
    function tt() {
      var t, r, e, l;
      if (t = Me, n.substr(Me, 2) === Se ? (r = Se, Me += 2) : (r = null, 0 === We && u(Ue)), 
      null !== r) {
        if (e = [], me.test(n.charAt(Me)) ? (l = n.charAt(Me), Me++) : (l = null, 0 === We && u(Ge)), 
        null !== l) for (;null !== l; ) e.push(l), me.test(n.charAt(Me)) ? (l = n.charAt(Me), 
        Me++) : (l = null, 0 === We && u(Ge)); else e = at;
        null !== e ? (Ee = t, r = Be(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
        t = at);
      } else Me = t, t = at;
      return t;
    }
    function rt() {
      var t, r;
      return t = Me, n.substr(Me, 2) === xe ? (r = xe, Me += 2) : (r = null, 0 === We && u(Te)), 
      null !== r && (Ee = t, r = Le()), null === r ? (Me = t, t = r) : t = r, t;
    }
    function et() {
      var t, r, e;
      return t = Me, 92 === n.charCodeAt(Me) ? (r = ve, Me++) : (r = null, 0 === We && u(ye)), 
      null !== r ? (n.length > Me ? (e = n.charAt(Me), Me++) : (e = null, 0 === We && u(Ce)), 
      null !== e ? (Ee = t, r = Ar(e), null === r ? (Me = t, t = r) : t = r) : (Me = t, 
      t = at)) : (Me = t, t = at), t;
    }
    var lt, ut = arguments.length > 1 ? arguments[1] : {}, ot = {
      regexp: c
    }, ct = c, at = null, it = "", st = "|", ft = '"|"', pt = function(n, t) {
      return t ? new Alternate(n, t[1]) : n;
    }, ht = function(n, t, r) {
      return new Match([ n ].concat(t).concat([ r ]));
    }, dt = "^", Ct = '"^"', kt = function() {
      return new Token("start");
    }, vt = "$", yt = '"$"', bt = function() {
      return new Token("end");
    }, At = function(n, t) {
      return new Quantified(n, t);
    }, wt = "Quantifier", xt = function(n, t) {
      return t && (n.greedy = !1), n;
    }, Tt = "{", gt = '"{"', Rt = ",", Ot = '","', Qt = "}", jt = '"}"', mt = function(n, t) {
      return new Quantifier(n, t);
    }, Gt = ",}", Ft = '",}"', St = function(n) {
      return new Quantifier(n, 1/0);
    }, Ut = function(n) {
      return new Quantifier(n, n);
    }, Bt = "+", Lt = '"+"', Mt = function() {
      return new Quantifier(1, 1/0);
    }, Et = "*", Ht = '"*"', $t = function() {
      return new Quantifier(0, 1/0);
    }, qt = "?", Dt = '"?"', Wt = function() {
      return new Quantifier(0, 1);
    }, zt = /^[0-9]/, It = "[0-9]", Jt = function(n) {
      return +n.join("");
    }, Kt = "(", Nt = '"("', Pt = ")", Vt = '")"', Xt = function(n) {
      return n;
    }, Yt = function(n) {
      return new CaptureGroup(n);
    }, Zt = "?:", _t = '"?:"', nr = function(n) {
      return new Group("non-capture-group", n);
    }, tr = "?=", rr = '"?="', er = function(n) {
      return new Group("positive-lookahead", n);
    }, lr = "?!", ur = '"?!"', or = function(n) {
      return new Group("negative-lookahead", n);
    }, cr = "CharacterSet", ar = "[", ir = '"["', sr = "]", fr = '"]"', pr = function(n, t) {
      return new CharSet(!!n, t);
    }, hr = "CharacterRange", dr = "-", Cr = '"-"', kr = function(n, t) {
      return new CharacterRange(n, t);
    }, vr = "Character", yr = /^[^\\\]]/, br = "[^\\\\\\]]", Ar = function(n) {
      return new Literal(n);
    }, wr = ".", xr = '"."', Tr = function() {
      return new Token("any-character");
    }, gr = "Literal", Rr = /^[^|\\\/.[()?+*$\^]/, Or = "[^|\\\\\\/.[()?+*$\\^]", Qr = "\\b", jr = '"\\\\b"', mr = function() {
      return new Token("backspace");
    }, Gr = function() {
      return new Token("word-boundary");
    }, Fr = "\\B", Sr = '"\\\\B"', Ur = function() {
      return new Token("non-word-boundary");
    }, Br = "\\d", Lr = '"\\\\d"', Mr = function() {
      return new Token("digit");
    }, Er = "\\D", Hr = '"\\\\D"', $r = function() {
      return new Token("non-digit");
    }, qr = "\\f", Dr = '"\\\\f"', Wr = function() {
      return new Token("form-feed");
    }, zr = "\\n", Ir = '"\\\\n"', Jr = function() {
      return new Token("line-feed");
    }, Kr = "\\r", Nr = '"\\\\r"', Pr = function() {
      return new Token("carriage-return");
    }, Vr = "\\s", Xr = '"\\\\s"', Yr = function() {
      return new Token("white-space");
    }, Zr = "\\S", _r = '"\\\\S"', ne = function() {
      return new Token("non-white-space");
    }, te = "\\t", re = '"\\\\t"', ee = function() {
      return new Token("tab");
    }, le = "\\v", ue = '"\\\\v"', oe = function() {
      return new Token("vertical-tab");
    }, ce = "\\w", ae = '"\\\\w"', ie = function() {
      return new Token("word");
    }, se = "\\W", fe = '"\\\\W"', pe = function() {
      return new Token("non-word");
    }, he = "\\c", de = '"\\\\c"', Ce = "any character", ke = function(n) {
      return new ControlCharacter(n);
    }, ve = "\\", ye = '"\\\\"', be = /^[1-9]/, Ae = "[1-9]", we = function(n) {
      return new BackReference(n);
    }, xe = "\\0", Te = '"\\\\0"', ge = /^[0-7]/, Re = "[0-7]", Oe = function(n) {
      return new Octal(n.join(""));
    }, Qe = "\\x", je = '"\\\\x"', me = /^[0-9a-fA-F]/, Ge = "[0-9a-fA-F]", Fe = function(n) {
      return new Hex(n.join(""));
    }, Se = "\\u", Ue = '"\\\\u"', Be = function(n) {
      return new Unicode(n.join(""));
    }, Le = function() {
      return new Token("null-character");
    }, Me = 0, Ee = 0, He = 0, $e = {
      line: 1,
      column: 1,
      seenCR: !1
    }, qe = 0, De = [], We = 0;
    if ("startRule" in ut) {
      if (!(ut.startRule in ot)) throw new Error("Can't start parsing from rule \"" + ut.startRule + '".');
      ct = ot[ut.startRule];
    }
    if (Token.offset = e, Token.text = r, lt = ct(), null !== lt && Me === n.length) return lt;
    throw o(De), Ee = Math.max(Me, qe), new t(De, Ee < n.length ? n.charAt(Ee) : null, Ee, l(Ee).line, l(Ee).column);
  }
  return n(t, Error), {
    SyntaxError: t,
    parse: r
  };
}(), index = 1, cgs = {};

exports = module.exports = parse, exports.Token = Token, exports.Alternate = Alternate, 
Alternate.prototype = Object.create(Token.prototype), Alternate.prototype.constructor = Alternate, 
exports.Match = Match, Match.prototype = Object.create(Token.prototype), Match.prototype.constructor = Match, 
exports.Group = Group, Group.prototype = Object.create(Token.prototype), Group.prototype.constructor = Group, 
exports.CaptureGroup = CaptureGroup, CaptureGroup.prototype = Object.create(Group.prototype), 
CaptureGroup.prototype.constructor = CaptureGroup, exports.Quantified = Quantified, 
Quantified.prototype = Object.create(Token.prototype), Quantified.prototype.constructor = Quantified, 
exports.Quantifier = Quantifier, Quantifier.prototype = Object.create(Token.prototype), 
Quantifier.prototype.constructor = Quantifier, exports.CharSet = CharSet, CharSet.prototype = Object.create(Token.prototype), 
CharSet.prototype.constructor = CharSet, exports.CharacterRange = CharacterRange, 
CharacterRange.prototype = Object.create(Token.prototype), CharacterRange.prototype.constructor = CharacterRange, 
exports.Literal = Literal, Literal.prototype = Object.create(Token.prototype), Literal.prototype.constructor = Literal, 
exports.Unicode = Unicode, Unicode.prototype = Object.create(Token.prototype), Unicode.prototype.constructor = Unicode, 
exports.Hex = Hex, Hex.prototype = Object.create(Token.prototype), Hex.prototype.constructor = Hex, 
exports.Octal = Octal, Octal.prototype = Object.create(Token.prototype), Octal.prototype.constructor = Octal, 
exports.BackReference = BackReference, BackReference.prototype = Object.create(Token.prototype), 
BackReference.prototype.constructor = BackReference, exports.ControlCharacter = ControlCharacter, 
ControlCharacter.prototype = Object.create(Token.prototype), ControlCharacter.prototype.constructor = ControlCharacter;
},{}]},{},[2]);
