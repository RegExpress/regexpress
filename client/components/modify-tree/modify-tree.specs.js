describe('Modify-Tree\n', function() {
  var $rootScope, $scope, modifyTree, tree1, tree2;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    modifyTree = $injector.get('modifyTree');

    tree1 = {"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4};
    tree2 = {"type":"match","offset":0,"text":"(a|b|c)","body":[{"type":"capture-group","offset":1,"text":"a|b|c","body":{"type":"alternate","offset":1,"text":"a|b|c","left":{"type":"match","offset":1,"text":"a","body":[{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":8}],"idNum":7},"right":{"type":"alternate","offset":3,"text":"b|c","left":{"type":"match","offset":3,"text":"b","body":[{"type":"literal","offset":3,"text":"b","body":"b","escaped":false,"idNum":11}],"idNum":10},"right":{"type":"match","offset":5,"text":"c","body":[{"type":"literal","offset":5,"text":"c","body":"c","escaped":false,"idNum":13}],"idNum":12},"idNum":9},"idNum":6},"index":1,"idNum":5}],"idNum":4};
  
  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    });
  });

  describe('modifyTree has the right functions\n', function(){
    it('should have addNode and removeNode functions', function(){
      expect(modifyTree.addNode).toEqual(jasmine.any(Function));
      expect(modifyTree.removeNode).toEqual(jasmine.any(Function));
    });
  });

  describe('removeNode removes nodes from the tree\n', function(){
    describe('removes a literal from a match\n', function(){
      it('removes a literal node from the front of a match node', function(){
        modifyTree.removeNode(5, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4}');
      });

      it('removes a literal node from the back of a match node', function(){
        modifyTree.removeNode(11, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9}],"idNum":4}');
      });

      it('removes a literal node from the middle of a match node', function(){
        modifyTree.removeNode(8, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4}');
      });
    });

    describe('removes a literal from a quantified\n', function(){
      it('removes the only node from a quantified', function(){
        modifyTree.removeNode(7, tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4}');
      });
    });

    describe('removes a literal from an alternate\n', function(){
      it('removes the only node from the first slot in an alternate', function(){
        modifyTree.removeNode(8, tree2);
        expect(JSON.stringify(tree2)).toEqual('{"type":"match","offset":0,"text":"(a|b|c)","body":[{"type":"capture-group","offset":1,"text":"a|b|c","body":{"type":"alternate","offset":3,"text":"b|c","left":{"type":"match","offset":3,"text":"b","body":[{"type":"literal","offset":3,"text":"b","body":"b","escaped":false,"idNum":11}],"idNum":10},"right":{"type":"match","offset":5,"text":"c","body":[{"type":"literal","offset":5,"text":"c","body":"c","escaped":false,"idNum":13}],"idNum":12},"idNum":9},"index":1,"idNum":5}],"idNum":4}');
      });

      it('removes the only node from a middle slot in an alternate', function(){
        modifyTree.removeNode(11, tree2);
        expect(JSON.stringify(tree2)).toEqual('{"type":"match","offset":0,"text":"(a|b|c)","body":[{"type":"capture-group","offset":1,"text":"a|b|c","body":{"type":"alternate","offset":1,"text":"a|b|c","left":{"type":"match","offset":1,"text":"a","body":[{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":8}],"idNum":7},"right":{"type":"match","offset":5,"text":"c","body":[{"type":"literal","offset":5,"text":"c","body":"c","escaped":false,"idNum":13}],"idNum":12},"idNum":6},"index":1,"idNum":5}],"idNum":4}');
      });

      it('removes the only node from the last slot in an alternate', function(){
        modifyTree.removeNode(13, tree2);
        expect(JSON.stringify(tree2)).toEqual('{"type":"match","offset":0,"text":"(a|b|c)","body":[{"type":"capture-group","offset":1,"text":"a|b|c","body":{"type":"alternate","offset":1,"text":"a|b|c","left":{"type":"match","offset":1,"text":"a","body":[{"type":"literal","offset":1,"text":"a","body":"a","escaped":false,"idNum":8}],"idNum":7},"right":{"type":"match","offset":3,"text":"b","body":[{"type":"literal","offset":3,"text":"b","body":"b","escaped":false,"idNum":11}],"idNum":10},"idNum":6},"index":1,"idNum":5}],"idNum":4}');
      });

    });
  });

});
