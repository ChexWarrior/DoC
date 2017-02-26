(function() {
  var API_ENDPOINT = 'https://deckofcardsapi.com/api';

  var request = function(method, uri, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, uri, true);
    xhr.responseType = 'json';

    xhr.onload = function(event) {
      if(this.status === 200) {
        callback(this.response);
      } else {
        console.log('Error!');
      }
    };

    xhr.send();
  };

  var shuffleDeck = function(callback, deckID) {
    var apiAction = API_ENDPOINT + '/deck/' + deckID + '/shuffle/';
    request('GET', apiAction, callback);
  };

  var createNewDeck = function(callback, shuffle, cards, numDecks) {
    var apiAction = API_ENDPOINT + '/deck/new/';
    var partialDeck = '';

    // if true the new deck will be shuffled on creation
    var doShuffle = shuffle || false;

    // number of new decks to create
    var numberDecks = numDecks || 1;

    // if a non-empty array the new deck will only contain these cards
    var startingCards = cards || [];
    
    // begin building final api uri...
    if(doShuffle) apiAction += 'shuffle/';

    // build partial deck if specified
    if(startingCards.length > 0) {
      partialDeck = '?cards=';

      startingCards.forEach(function(card) {
        partialDeck += card + ',';
      });

      // remove trailing comma
      partialDeck = partialDeck.substr(0, partialDeck.lastIndexOf(','));
    }

    apiAction += partialDeck;

    // add number of decks, if a partial deck is specified only one deck can be created
    if(numberDecks > 1 && !partialDeck) apiAction += '?deck_count=' + numberDecks;

    return request('GET', apiAction, callback);
  };

  // create final DoC object
  var DoC = {
    newDeck: createNewDeck
  };

  // attach to window
  if(typeof window === 'object' && typeof window.document === 'object') {
    window.DoC = DoC;
  }
}());