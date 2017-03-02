
describe('A new deck', function() {
  var callbacks = {};
  var parameters = {};
  var resetParameters = function() {
    callbacks = {};
    parameters = {};
  };

  it('can be called with no parameters', function(done) {
    callbacks.success = function(deck) {
      expect(deck.deck_id).toEqual(jasmine.anything());
      done();
    };

    DoC.createDeck(callbacks);
  });

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

describe('Drawing from a deck', function() {
  // deck created with no parameters
  var deckID;
  var callbacks = {};

  beforeAll(function(done) {
    // create the default deck
    DoC.createDeck({
      success: function(deck) {
        deckID = deck.deck_id;
        done();
      }
    });
  });

  it('returns one card if no numCards parameter specified', function(done) {
    var success = function(response) {
      expect(response.cards.length).toBe(1);
      done();
    };

    callbacks.success = success;
    DoC.drawFromDeck(callbacks, { deckID: deckID });
  });

  it('returns an amount of cards equal to numCards parameter', function(done) {
    var success = function(response) {
      expect(response.cards.length).toEqual(3);
      done();
    };

    callbacks.success = success;
    DoC.drawFromDeck(callbacks, { deckID: deckID, numCards: 3});
  });
});