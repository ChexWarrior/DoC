/**
 * @typedef Deck
 * @property {bool}   success                  - If true indicates that the last API operation performed on deck was a success.
 * @property {string} deck_id                  - The unique identifier of the deck.
 * @property {bool}   shuffled                 - If true indicates the deck was shuffled.
 * @property {number} remaining                - The amount of cards left in the deck.
 * @property {object} piles                    - An object containing the piles create from current deck
 * @property {object} piles.pileName           - A pile object created from deck
 * @property {object} piles.pileName.remaining - Number of cards remaining in pile
 *
 * @typedef DeckDraw
 * @property {bool}   success       - If true indicates that the last API operation performed on deck was a success.
 * @property {array}  cards         - Contains the card objects drawn from the deck.
 * @property {string} cards[].image - Contains a url to an image of the card type.
 * @property {string} cards[].value - Non-suit value of card, will be one of the following: 2-10, JACK, QUEEN, KING or ACE.
 * @property {string} cards[].suit  - Suit value of card, will be one of the following: HEARTS, CLUBS, SPADES or DIAMONDS.
 * @property {string} cards[].code  - Two character code for Value and Suit combination of card. The Ace of Spades would 
 *                                    have a code of "AS".
 * @property {string} deck_id       - The unique identifier of the deck.
 * @property {number} remaining     - The amount of cards left in the deck.
 */



(function() {
  var API_ENDPOINT = 'https://deckofcardsapi.com/api';

  var request = function(method, uri) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, uri, true);
      xhr.responseType = 'json';

      xhr.onload = function(event) {
        if(this.status === 200) {
          resolve(this.response);
        } else {
          reject(req.status);
        }
      };

      xhr.onerror = function(error) {
        reject(error);
      };

      xhr.send();
    });
  };

  /**
   * @function shuffleDeck
   * @param  {string} deckID - The id of an existing deck
   * @return {Deck | Error}
   */
  var shuffleDeck = function(deckID) {
    // TODO: Default parameters and validity checking
    var apiAction = API_ENDPOINT + '/deck/' + deckID + '/shuffle/';
    return request('GET', apiAction);
  };

  /**
   * @function drawFromDeck
   * @param  {object} parameters          - Can consist of two properties
   * @param  {string} parameters.deckID   - The ID of the deck to draw from. This parameter is required.
   * @param  {number} parameters.numCards - The number of cards to draw from the deck. Defaults to 1.
   * @return {DeckDraw | Error}
   */
  var drawFromDeck = function(parameters) {
    var apiAction = API_ENDPOINT + /deck/;

    if(parameters) {
      if (parameters.deckID) apiAction += parameters.deckID + '/draw/';
      if (parameters.numCards) apiAction += '?count=' + parameters.numCards;
    }
    
    return request('GET', apiAction);
  }

  /**
   * @function createDeck
   * @param  {object} parameters             - Can consist of three properties:
   * @param  {bool}   parameters.shuffle     - If true the deck will be shuffled on creation. Defaults to false.
   * @param  {array}  parameters.partialDeck - An array of card codes that the deck will contain if the array isn't empty.
   * @param  {number} parameters.numDecks    - The amount of cards this deck will contain based on amount of decks.
   *                                           1 deck gives 52 cards, 2 decks gives 104, etc. Defaults to one. If a 
   *                                           value is specified for the partialDeck parameter this value is ignored.
   * @return {Deck | Error}
   */
  var createDeck = function(parameters) {
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

    return request('GET', apiAction);
  };

  /**
   * @function addToPile
   * @param {object} parameters
   * @param {string} parameters.deckID The identifier of the deck from which the cards added to the pile will come
   * @param {string} parameters.pileName The name of the pile to add the cards.
   * @param {array}  parameters.cardsToAdd An array of card objects that represent the cards added to the pile
   * @return {Deck}
   */
  var addToPile = function(parameters) {
    var apiAction = API_ENDPOINT + '/deck/';
    var deckID = '';
    var pileName = '';
    var addedCards = '';
    var cardsToAdd = '';

    if(parameters) {
      if(parameters.deckID) deckID = parameters.deckID;
      if(parameters.pileName) pileName = parameters.pileName;
      if(parameters.cardsToAdd) {
        cardsToAdd = parameters.cardsToAdd;

        if(cardsToAdd.length > 0) {
          addedCards = '?cards=';
          cardsToAdd.forEach(function(card) {
            addedCards += card.code + ',';
          });

          // remove trailing comma
          addedCards = addedCards.substr(0, addedCards.lastIndexOf(','));
        }
      }
    }

    apiAction += deckID + '/pile/' + pileName + '/add/' + addedCards;
    return request('GET', apiAction);
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