describe('Workspace', function() {
  var $rootScope, $scope;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    workspace = $injector.get('workspace');

  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    })
  })

  describe('workspace has the right functions\n', function(){
    it('should have a getComponentNode function', function(){
      expect(workspace.getComponentNode).toEqual(jasmine.any(Function));
    });
  });

  describe('getComponentNode returns the correct nodes\n', function(){
    describe('handles non-terminal types\n', function(){
      it('should support start and end objects', function(){
        var start = workspace.getComponentNode('start');
        expect(JSON.stringify(start)).toEqual('{"type":"start"}');
        var end = workspace.getComponentNode('end');
        expect(JSON.stringify(end)).toEqual('{"type":"end"}');
      });

      it('should support any-character objects', function(){
        var anyChar = workspace.getComponentNode('any-character');
        expect(JSON.stringify(anyChar)).toEqual('{"type":"any-character"}');
      });

      it('should support word and non-word objects', function(){
        var word = workspace.getComponentNode('word');
        expect(JSON.stringify(word)).toEqual('{"type":"word"}');
        var nonword = workspace.getComponentNode('non-word');
        expect(JSON.stringify(nonword)).toEqual('{"type":"non-word"}');
      });

      it('should support white-space and non-white-space objects', function(){
        var whitespace = workspace.getComponentNode('white-space');
        expect(JSON.stringify(whitespace)).toEqual('{"type":"white-space"}');
        var nonwhitespace = workspace.getComponentNode('non-white-space');
        expect(JSON.stringify(nonwhitespace)).toEqual('{"type":"non-white-space"}');
      });

      it('should support digit and non-digit objects', function(){
        var digit = workspace.getComponentNode('digit');
        expect(JSON.stringify(digit)).toEqual('{"type":"digit"}');
        var nondigit = workspace.getComponentNode('non-digit');
        expect(JSON.stringify(nondigit)).toEqual('{"type":"non-digit"}');
      });
    });

    describe('handles groups\n', function(){
      it('should support match and capture-group objects', function(){
        var text = workspace.getComponentNode('text');
        expect(JSON.stringify(text)).toEqual('{"type":"match","body":[{"type":"literal","body":"a"},{"type":"literal","body":"b"},{"type":"literal","body":"c"}]}');
        var captureGroup = workspace.getComponentNode('capture-group');
        expect(JSON.stringify(captureGroup)).toEqual('{"type":"capture-group","body":' + JSON.stringify(text) + '}');
      });
    });

    describe('handles choice blocks\n', function(){
      it('should support alternate objects', function(){
        var text = workspace.getComponentNode('text');
        var alternate = workspace.getComponentNode('alternate');
        expect(JSON.stringify(alternate)).toEqual('{"type":"alternate","left":' + JSON.stringify(text) + ',"right":' + JSON.stringify(text) + '}');
      });

      it('should support optional blocks', function(){
        var text = workspace.getComponentNode('text');
        var optional = workspace.getComponentNode('optional');
        expect(JSON.stringify(optional)).toEqual('{"type":"quantified","body":' + JSON.stringify(text) + ',"quantifier":{"min":0,"max":1}}');
      });

      it('should support repeating blocks', function(){
        var text = workspace.getComponentNode('text');
        var repeating = workspace.getComponentNode('repeating');
        expect(JSON.stringify(repeating)).toEqual('{"type":"quantified","body":' + JSON.stringify(text) + ',"quantifier":{"min":1,"max":null}}');
      });
    });
  });
});
