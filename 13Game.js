const Card = require('./Card');
const Combo = require('./Combo');

class Game{
	
	constructor(p1, p2, p3, p4) {		
		this.players = [p1, p2, p3, p4];
		this.playerIn = [true, true, true, true];
		this.winners = [];
		this.curPlayer = 0;
		this.curTurn = 0;
		
		this.pHands = [];
		for (var i = 0; i < 4; i++){
			this.pHands[i] = new Combo();
		}
		
		// Randomly distribute cards to each player
		for(var i = 1; i <= 52; i++){
			var randomPlayer = Math.floor(Math.random() * 4);
			// Make sure no one gets more than 13 cards
			while(this.pHands[randomPlayer].hand.length >= 13){
				randomPlayer += 1;
				randomPlayer %= 4;
			}
			
			var card = new Card(i % 13, Math.floor(i / 13) % 4);
			this.pHands[randomPlayer].addCard(card);
				
			// Make the person who has the 3 of spades go first
			if(card.value == 0 && card.suit == 0){
				this.curPlayer = randomPlayer;
			}
		}

		this.curCombo = new Combo();
	}
	
	// Determine if a given combo can beat the current combo
	canTop(combo){
		if(!Combo.isValid(combo))
			return false;
		
		if(this.curTurn <= 0 && !Combo.hasThreeOfSpades(combo))
			return false;
		
		var oldCombo = this.curCombo;
		// Can play anything if there's nothing in the current pot
		if(oldCombo.hand.length <= 0)
			return true;
		
		// See if a bomb can be played
		if(Combo.isPairBomb(oldCombo) || Combo.isFourOfKind(oldCombo)){
			if(Combo.getAmtOfTwos(this.curCombo) > 0){
				return true;
			}
		}

		// Otherwise make sure played hand and combo in pot matches
		if((Combo.isSingle(oldCombo) && Combo.isSingle(combo)) 
			|| (Combo.isPair(oldCombo) && Combo.isPair(combo)) 
			|| (Combo.isTriple(oldCombo) && Combo.isTriple(combo))
			|| (Combo.isRun(oldCombo) && Combo.isRun(combo))
			|| (Combo.isPairBomb(oldCombo) && Combo.isPairBomb(combo))
			|| (Combo.isFourOfKind(oldCombo) && Combo.isFourOfKind(combo))){
			
			if(oldCombo.hand[0].value < combo.hand[0].value)
				return true;
			else if(oldCombo.hand[0].value == combo.hand[0].value)
				return oldCombo.hand[0].suit < combo.hand[0].suit;
		}
		return false;
	}

	// Try to set a given combo as the current combo
	playCombo(combo){
		if(this.canTop(combo)){
			this.curCombo = combo;
			// Remove each card in the played combo from the player's hand
			for(var i = 0; i < combo.hand.length; i++){
				this.pHands[this.curPlayer].removeCard(combo.hand[i]);
			}
			// See if player has won
			console.log(this.pHands[this.curPlayer].hand.length);
			if(this.pHands[this.curPlayer].hand.length <= 0){
				this.winners.push(this.curPlayer);
				console.log('winners: ' + this.winners.length.toString());
				this.playerIn[this.curPlayer] = false;
			}
			this.nextPlayer();
			return true;
		}
		return false;
	}

	// Advance to the next player still in
	nextPlayer(){
		var prevPlayer = this.curPlayer;
		do{
			this.curPlayer += 1;
			this.curPlayer %= 4;
			if(prevPlayer == this.curPlayer)
				break;
		} while(this.pHands[this.curPlayer].hand.length <= 0 || !this.playerIn[this.curPlayer])
	
		// Reset current combo if there's only one player left in the round
		var playersOut = 0;
		for(var i = 0; i < this.playerIn.length; i++){
			if(!this.playerIn[i])
				playersOut += 1;
		}

		if(playersOut >= 3){
			this.resetRound();
		}

		this.curTurn += 1;
	}
	
	// Allows each player with cards to play in the round again
	resetRound(){
		this.curCombo = new Combo();
		for(var i = 0; i < this.playerIn.length; i++){
			if(this.pHands[i].hand.length > 0)
				this.playerIn[i] = true;
			else
				this.playerIn[i] = false;
		}
	}

	// Skips a player's turn and they stay out for the remainder of the round
	passRound(){
		this.playerIn[this.curPlayer] = false;
		this.nextPlayer();
	}
	
	// Changes the class into a JSON object
	toJSON(){
		var jHands = [];
		for (var i = 0; i < 4; i++){
			jHands[i] = this.pHands[i].hand;
		}
		
		return {
			curPlayer: this.curPlayer,
			curTurn: this.curTurn,
			curCombo: this.curCombo.hand,
			winners: this.winners,
			pHands: jHands,
			pIn: this.playerIn
		};
	}
}

module.exports = Game;
