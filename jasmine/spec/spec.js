describe('A new deck of cards', function() {

  it('can be shuffled', function(done) {
    var callback = function(deck) {
      expect(deck.shuffled).toBe(true);
      done();
    };

    DoC.createDeck(callback, true);
  });
});