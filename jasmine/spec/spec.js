
describe('A new deck', function() {
  var callbacks = {};
  var parameters = {};
  var resetParameters = function() {
    callbacks = {};
    parameters = {};
  };


  it('can be shuffled on initialization', function(done) {
    callbacks.success = function(deck) {
      expect(deck.shuffled).toBe(true);
      done();
    };

    parameters.shuffle = true;
    DoC.createDeck(callbacks, parameters);
  });

  it('can contain multiple decks', function(done) {
    resetParameters();
    callbacks.success = function(deck) {
      expect(deck.remaining).toBe(156);
      done();
    };

    parameters.numDecks = 3;
    DoC.createDeck(callbacks, parameters);
  });

  it('can contain a partial amount of cards', function(done) {
    resetParameters();
    callbacks.success = function(deck) {
      expect(deck.remaining).toBe(4);
      done();
    };

    parameters.partialDeck = [ 'AS', 'AC', 'AD', 'AH' ];
    DoC.createDeck(callbacks, parameters);
  });

  it('initialized as a partial deck and multiple decks only includes partial cards', function(done) {
    resetParameters();
    callbacks.success = function(deck) {
      expect(deck.remaining).toBe(3);
      done();
    };

    parameters.partialDeck = ['AS', 'AD', 'AH'];
    parameters.numDecks = 3;
    DoC.createDeck(callbacks, parameters);
  });
});