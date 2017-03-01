(function() {
  var API_ENDPOINT = 'https://deckofcardsapi.com/api';

  var request = function(method, uri, callbacks) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, uri, true);
    xhr.responseType = 'json';

    xhr.onload = function(event) {
      if(callbacks) {
        if(this.status === 200) {
          if(callbacks.success) callbacks.success(this.response);
        } else {
          if(callbacks.failure) callbacks.failure(this.response);
        }

        if(callbacks.complete) callbacks.complete(this.response);
      }
    };

    xhr.onerror = function(error) {
      if(callbacks) {
        if(callbacks.failure) callbacks.failure(error);
        if(callbacks.complete) callbacks.complete(error);
      }
    };

    xhr.send();
  };

  // TODO: Change methods to take error and success callbacks
  // TODO: Add unit tests
  // TODO: Add description to methods...

  var shuffleDeck = function(callback, deckID) {
    // TODO: Default parameters and validity checking
    var apiAction = API_ENDPOINT + '/deck/' + deckID + '/shuffle/';
    request('GET', apiAction, callback);
  };

  /**
   * @param  {object} callbacks Should consist of three properties: success, failure, complete
   *                  Each callback should take one parameter that will represent the deck in case
   *                  off success and the error object in case of failure.
   * @param  {object} parameters Can consist of two properties
   *         {string} parameters.deckID The ID of the deck to draw from. This parameter is required.
   *         {number} parameters.numCards The number of cards to draw from the deck. Defaults to 1.
   * @return {object} deck Represents current status of deck. Has the follwing properties:
   *         {bool}   success True if operation was completed successfully
   *         {array}  cards Array of cards objects. Each object has following properties:
   *         {string} image Url containing picture of card type
   *         {string} value Non-suit value of card (2-10, JACK, QUEEN, KING, ACE)
   *         {string} suit Suit value of card (HEARTS, CLUBS, SPADES, DIAMONDS)
   *         {string} code Two character code for Value and Suit combination of card. The
   *                       Ace of Spades would have a code of "AS"
   */
  var drawFromDeck = function(callbacks, parameters) {
    var apiAction = API_ENDPOINT + /deck/;

    if(parameters) {
      if (parameters.deckID) apiAction += parameters.deckID + '/draw/';
      if (parameters.numCards) apiAction += '?count=' + parameters.numCards;
    }
    
    request('GET', apiAction, callbacks);
  }

  /**
   * @param  {object} callbacks Should consist of three properties: success, failure, complete
   *                  Each callback should take one parameter that will represent the deck in case
   *                  off success and the error object in case of failure.
   * @param  {object} parameters Can consist of three properties:
   *         {bool}   parameters.shuffle If true the deck will be shuffled on creation. Defaults to false.
   *         {array}  parameters.partialDeck An array of card codes that the deck will contain if the array isn't empty.
   *         {number} parameters.numDecks The amount of cards this deck will contain based on amount of decks.
   *                  1 deck gives 52 cards, 2 decks gives 104, etc. Defaults to one. If a value is specified
   *                  for the partialDeck parameter this value is ignored.
   * @return {object} deck Represents current status of  Has the following properties:
   *         {bool}   success True if operation was completed successfully
   *         {string} deck_id Unique ID for this deck
   *         {bool}   shuffled True if deck was shuffled.
   *         {number} remaining Amount of cards currently in deck
   */
  var createDeck = function(callbacks, parameters) {
    var apiAction = API_ENDPOINT + '/deck/new/';
    var partialDeck = '';
    var startingCards = [];
    var numberDecks = 1;

    if(parameters) {
      if(parameters.shuffle) apiAction += 'shuffle/';
      
      if(parameters.partialDeck) {
        startingCards = parameters.partialDeck;

        if(startingCards.length > 0) {
          partialDeck = '?cards=';

          startingCards.forEach(function(card) {
            partialDeck += card + ',';
          });

          // remove trailing comma
          partialDeck = partialDeck.substr(0, partialDeck.lastIndexOf(','));
          apiAction += partialDeck;
        }
      }

      // add number of decks, if a partial deck is specified ignore this parameter
      if(parameters.numDecks && !partialDeck)  {
        numberDecks = parameters.numDecks;
        apiAction += '?deck_count=' + numberDecks;
      }
    }

    request('GET', apiAction, callbacks);
  };

  var addToPile = function(callback, pileName, sourceDeck, cardsToAdd) {
    // TODO: Default parameters and validity checking
    var apiAction = API_ENDPOINT + '/deck/' + sourceDeck + '/pile/' + pileName + '/add/';
    var addedCards = '';

    if(cardsToAdd.length > 0) {
      addedCards = '?cards=';
      cardsToAdd.forEach(function(card) {
        addedCards += card.code + ',';
      });

      // remove trailing comma
      addedCards = addedCards.substr(0, addedCards.lastIndexOf(','));
    }

    apiAction += addedCards;
    request('GET', apiAction, callback);
  };

  // create final DoC object
  var DoC = {
    createDeck: createDeck,
    shuffleDeck: shuffleDeck,
    drawFromDeck: drawFromDeck,
    addToPile: addToPile
  };

  // attach to window
  if(typeof window === 'object' && typeof window.document === 'object') {
    window.DoC = DoC;
  }
}());