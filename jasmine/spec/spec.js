describe('A new deck', function() {
  it('can be called with no parameters', function(done) {
    var success = function(deck) {
      expect(deck.deck_id).toEqual(jasmine.anything());
      done();
    };

    DoC.createDeck().then(success);
  });

  it('can be shuffled on initialization', function(done) {
    var success = function(deck) {
      expect(deck.shuffled).toBe(true);
      done();
    };

    DoC.createDeck({ shuffle: true }).then(success);
  });

  it('can contain multiple decks', function(done) {
    var success = function(deck) {
      expect(deck.remaining).toBe(156);
      done();
    };

    DoC.createDeck({ numDecks: 3 }).then(success);
  });

  it('can contain a partial amount of cards', function(done) {
    var success = function(deck) {
      expect(deck.remaining).toBe(4);
      done();
    };

    DoC.createDeck({ partialDeck: [ 'AS', 'AC', 'AD', 'AH' ] }).then(success);
  });

  it('initialized as a partial deck and multiple decks only includes partial cards', function(done) {
    var success = function(deck) {
      expect(deck.remaining).toBe(3);
      done();
    };

    DoC.createDeck({ partialDeck: ['AS', 'AD', 'AH'], numDecks: 3 }).then(success);
  });
});

describe('Drawing from a deck', function() {
  var deckID;

  beforeAll(function(done) {
    DoC.createDeck().then(function(deck) {
      deckID = deck.deck_id;
      done();
    });
  });

  it('returns one card if no numCards parameter specified', function(done) {
    var success = function(response) {
      expect(response.cards.length).toBe(1);
      done();
    };

    DoC.drawFromDeck({ deckID: deckID }).then(success);
  });

  it('returns an amount of cards equal to numCards parameter', function(done) {
    var success = function(response) {
      expect(response.cards.length).toEqual(3);
      done();
    };

    DoC.drawFromDeck({ deckID: deckID, numCards: 3}).then(success);
  });
});

describe('Shuffling a deck', function() {
  var deckID;

  beforeAll(function(done) {
    DoC.createDeck().then(function(deck) {
      deckID = deck.deck_id;
      done();
    });
  });

  it('returns true when successful', function(done) {
    var success = function(deck) {
      expect(deck.success).toBe(true);
      done();
    };

    DoC.shuffleDeck(deckID).then(success);
  });
});

describe('A new pile', function() {
  var deckID;

  beforeAll(function(done) {
    DoC.createDeck().then(function(deck) {
      deckID = deck.deck_id;
      done();
    });
  });

  it('will only contain the cards added', function(done) {
    var drawSuccess = function(deck) {
      return DoC.addToPile({ 
        deckID: deckID, 
        pileName: 'discard',
        cardsToAdd: deck.cards
      });
    };

    var addSuccess = function(deck) {
      expect(deck.piles.discard).toEqual(jasmine.anything());
      expect(deck.piles.discard.remaining).toEqual(3);
      done();
    };

    DoC.drawFromDeck({
      deckID: deckID,
      numCards: 3
    }).then(drawSuccess).then(addSuccess);
  });
});