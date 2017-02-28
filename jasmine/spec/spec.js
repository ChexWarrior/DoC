describe('A new deck', function() {

  it('can be shuffled on initialization', function(done) {
    var callback = function(deck) {
      expect(deck.shuffled).toBe(true);
      done();
    };

    DoC.createDeck(callback, true);
  });

  it('can contain multiple decks', function(done) {
    var callback = function(deck) {
      expect(deck.remaining).toBe(156);
      done();
    };

    DoC.createDeck(callback, false, [], 3);
  });

  it('can contain a partial amount of cards', function(done) {
    var callback = function(deck) {
      expect(deck.remaining).toBe(4);
      done();
    };

    var cardsToAdd = [ 'AS', 'AC', 'AD', 'AH' ];
    DoC.createDeck(callback, false, cardsToAdd);
  });

  it('cannot contain more than one of the same card', function(done) {
    var callback = function(deck) {
      expect(deck.remaining).toBe(3);
      done();
    };

    var cardsToAdd = [ 'AS', 'AS', 'AD', 'AH' ];
    DoC.createDeck(callback, false, cardsToAdd);
  });

  it('initialized as a partial deck and multiple decks only includes partial cards', function(done) {
    var callback = function(deck) {
      expect(deck.remaining).toBe(3);
      done();
    };

    var cardsToAdd = ['AS', 'AD', 'AH'];
    DoC.createDeck(callback, false, cardsToAdd, 3);
  });
});