describe('modifyTree.editText\n', function() {
  var $rootScope, $scope, modifyTree, tree1, tree2, oneQuantified;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    modifyTree = $injector.get('modifyTree');

    tree1 = {"type":"match","offset":0,"text":"abc","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":5},{"type":"literal","offset":2,"text":"c","body":"c","escaped":false,"idNum":5}],"idNum":4};    
    tree2 = {"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"literal","offset":0,"text":"a","body":"a","escaped":false,"idNum":5},{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4};
    oneQuantified = {"type":"match","offset":0,"text":"d?","body":[{"type":"quantified","offset":0,"text":"d?","body":{"type":"literal","offset":0,"text":"d","body":"d","escaped":false,"idNum":8},"quantifier":{"type":"quantifier","offset":1,"text":"?","min":0,"max":1,"greedy":true},"idNum":7}],"idNum":6} 

  }));

  describe('editText is a function on modifyTree\n', function(){
    it('should have addNode and removeNode functions', function(){
      expect(modifyTree.editText).toEqual(jasmine.any(Function));
    });
  });

  describe('it should edit the text of a node\n', function(){
    describe('match node', function() {
      it('it should replace all the literals with new ones', function(){
        modifyTree.editText(5, "xyz", tree1);
        expect(JSON.stringify(tree1)).toEqual('{"type":"match","offset":0,"text":"xyz","body":[{"type":"literal","offset":0,"text":"x","body":"x","escaped":false},{"type":"literal","offset":1,"text":"y","body":"y","escaped":false},{"type":"literal","offset":2,"text":"z","body":"z","escaped":false}],"idNum":4}');
      });

      it('it should just remove the selected node', function(){
        modifyTree.editText(5, "", tree2);
        expect(JSON.stringify(tree2)).toEqual('{"type":"match","offset":0,"text":"ab?cd?e","body":[{"type":"quantified","offset":1,"text":"b?","body":{"type":"literal","offset":1,"text":"b","body":"b","escaped":false,"idNum":7},"quantifier":{"type":"quantifier","offset":2,"text":"?","min":0,"max":1,"greedy":true},"idNum":6},{"type":"literal","offset":3,"text":"c","body":"c","escaped":false,"idNum":8},{"type":"quantified","offset":4,"text":"d?","body":{"type":"literal","offset":4,"text":"d","body":"d","escaped":false,"idNum":10},"quantifier":{"type":"quantifier","offset":5,"text":"?","min":0,"max":1,"greedy":true},"idNum":9},{"type":"literal","offset":6,"text":"e","body":"e","escaped":false,"idNum":11}],"idNum":4}');
      });
    });

    describe('quantified node', function() {
      it('if new string is one character, it replaces the old one', function() {
        modifyTree.editText(8, "z", oneQuantified);
        expect(JSON.stringify(oneQuantified)).toEqual('{"type":"match","offset":0,"text":"d?","body":[{"type":"quantified","offset":0,"text":"z?","body":{"type":"literal","offset":0,"text":"z","body":"z","escaped":false},"quantifier":{"type":"quantifier","offset":1,"text":"?","min":0,"max":1,"greedy":true},"idNum":7}],"idNum":6}')
      });

      it('if new string is more than one charcter, it makes a new capture and match group as well', function() {
        modifyTree.editText(8, "xyz", oneQuantified);
        expect(JSON.stringify(oneQuantified)).toEqual('{"type":"match","offset":0,"text":"d?","body":[{"type":"quantified","offset":0,"text":"(xyz)?","body":{"type":"capture-group","offset":0,"text":"(xyz)?","body":{"type":"match","offset":0,"text":"xyz","body":[{"type":"literal","offset":0,"text":"x","body":"x","escaped":false},{"type":"literal","offset":1,"text":"y","body":"y","escaped":false},{"type":"literal","offset":2,"text":"z","body":"z","escaped":false}]}},"quantifier":{"type":"quantifier","offset":1,"text":"?","min":0,"max":1,"greedy":true},"idNum":7}],"idNum":6}');
      });

    });

  });
});
