describe('modifyTree.editText\n', function() {
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

  describe('editText is a function on modifyTree\n', function(){
    it('should have addNode and removeNode functions', function(){
      expect(modifyTree.editText).toEqual(jasmine.any(Function));
    });
  });

  describe('it should edit the text of a node\n', function(){
    it('removes a literal node from the front of a match node', function(){
      modifyTree.editText(5, "xyz",tree4);
      expect(JSON.stringify(tree4)).toEqual('{"type":"match","offset":0,"text":"xyz","body":[{"type":"literal","offset":0,"text":"x","body":"x","escaped":false,"idNum":5},{"type":"literal","offset":1,"text":"y","body":"y","escaped":false,"idNum":5},{"type":"literal","offset":2,"text":"z","body":"z","escaped":false,"idNum":5}],"idNum":4}');
    });
  });
});
