describe('Modify-Tree-addNode\n', function() {
  var $rootScope, $scope, modifyTree, tree1, tree2, tree3, tree4, tree5;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    modifyTree = $injector.get('modifyTree');

    tree1 = {"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4};
    tree2 = {"type":"match","offset":0,"text":"(a)","body":[{"type":"capture-group","offset":1,"text":"a","body":{"type":"match","offset":1,"text":"a","body":[{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":7}],"idNum":6},"index":1,"idNum":5}],"idNum":4};
    tree3 = {"type":"match","offset":0,"text":"(a|b|c)","body":[{"type":"capture-group","offset":1,"text":"a|b|c","body":{"type":"alternate","offset":1,"text":"a|b|c","left":{"type":"match","offset":1,"text":"a","body":[{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":8}],"idNum":7},"right":{"type":"alternate","offset":3,"text":"b|c","left":{"type":"match","offset":3,"text":"b","body":[{"type":"literal","offset":3,"text":"b","body":"b","escaped":false,"idNum":11}],"idNum":10},"right":{"type":"match","offset":5,"text":"c","body":[{"type":"literal","offset":5,"text":"c","body":"c","escaped":false,"idNum":13}],"idNum":12},"idNum":9},"idNum":6},"index":1,"idNum":5}],"idNum":4};
    tree4 = {"type":"match","offset":0,"text":"abc","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":5},{"type":"literal","offset":2,"text":"c","body":"c","escaped":false,"idNum":5}],"idNum":4};    
    tree5 = {"type":"match","offset":0,"text":"^a$","body":[{"type":"start","offset":0,"text":"^","idNum":5},{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":6},{"type":"end","offset":2,"text":"$","idNum":7}],"idNum":4};

  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    });
  });

  describe('modifyTree has the right functions\n', function(){
    it('should have an addNode function', function(){
      expect(modifyTree.addNode).toEqual(jasmine.any(Function));
    });
  });

  describe('addNode adds nodes to the tree\n', function(){
    describe('adds a node to a match\n', function(){
      it('adds a literal at the front of a match', function(){
        modifyTree.addNode(null, 4, {"type":"literal","body":"z"}, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","body":"z"},{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4}');
      });

      it('adds a literal at the end of a match', function(){
        modifyTree.addNode(11, 4, {"type":"literal","body":"z"}, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11},{"type":"literal","body":"z"}],"idNum":4}');
      });

      it('adds a literal in the middle of a match', function(){
        modifyTree.addNode(8, 4, {"type":"literal","body":"z"}, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"literal","body":"z"},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4}');
      });
    });
    describe('adds a node to an alternate\n', function(){
      it('adds a literal to the end of an alternate', function(){
        modifyTree.addNode(null, 6, {"type":"match","body":[{"type":"literal","body":"d"}]}, tree3);
        expect(JSON.stringify(tree3)).toEqual('{"type":"match","offset":0,"text":"(a|b|c)","body":[{"type":"capture-group","offset":1,"text":"a|b|c","body":{"type":"alternate","offset":1,"text":"a|b|c","left":{"type":"match","offset":1,"text":"a","body":[{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":8}],"idNum":7},"right":{"type":"alternate","offset":3,"text":"b|c","left":{"type":"match","offset":3,"text":"b","body":[{"type":"literal","offset":3,"text":"b","body":"b","escaped":false,"idNum":11}],"idNum":10},"right":{"type":"alternate","left":{"type":"match","offset":5,"text":"c","body":[{"type":"literal","offset":5,"text":"c","body":"c","escaped":false,"idNum":13}],"idNum":12},"right":{"type":"match","body":[{"type":"literal","body":"d"}]}},"idNum":9},"idNum":6},"index":1,"idNum":5}],"idNum":4}');
      });
    });
  });
});