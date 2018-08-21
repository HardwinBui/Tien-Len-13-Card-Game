const Card = require('./Card');
const Combo = require('./Combo');

class Game{
	
	constructor(p1, p2, p3, p4) {		
		this.players = [p1, p2, p3, p4];
		this.curPlayer = 0;
		this.curTurn = 0;
		
		this.pHands = [];
		for (var i = 0; i < 4; i++){
			this.pHands[i] = new Combo();
		}
		
		// Randomly distribute cards to each player
		for(var i = 1; i <= 52; i++){
			var randomPlayer = Math.floor(Math.random() * 4);
			if(this.pHands[randomPlayer].hand.length < 13){
				var card = new Card(i % 13, Math.floor(i / 13));
				this.pHands[randomPlayer].addCard(card);
				
				// Make the person who has the 3 of spades go first
				if(card.value == 2 && card.suit == 0){
					this.curPlayer = randomPlayer;
				}
			}
			else {
				i--;
			}
		}

		this.curCombo = new Combo();
	
		
		
		this.curCombo.addCard(new Card(3, 0));
	/*	this.curCombo.addCard(new Card(2, 1));
		this.curCombo.addCard(new Card(2, 1));
		this.curCombo.addCard(new Card(2, 0));
		this.curCombo.printCombo();
		console.log(Combo.isPairBomb(this.curCombo));
		*/
		//	console.log(Combo.isValid(this.curCombo));

		// Check for instant wins
		
		// Print player 1's hand
		/*
		console.log('player 1:');
		for(var i = 0; i < 13; i++){
			console.log(this.pHands[randomPlayer][i].value + 
				" " + this.pHands[randomPlayer][i].suit);
		}
		*/
	}
	
	// Determine if a given combo can beat the current combo
	canTop(combo){
		if(!Combo.isValid(combo))
			return false;
		
		var oldCombo = this.curCombo;
		// Can play anything if there's nothing in the current pot
		if(oldCombo.hand.length <= 0)
			return true;

		// Otherwise make sure played hand and combo in pot matches
		if((Combo.isSingle(oldCombo) && Combo.isSingle(combo)) 
			|| (Combo.isPair(oldCombo) && Combo.isPair(combo)) 
			|| (Combo.isTriple(oldCombo) && Combo.isTriple(combo))
			|| (Combo.isRun(oldCombo) && Combo.isRun(combo))
			|| (Combo.isPairBomb(oldCombo) && Combo.isPairBomb(combo))
			|| (Combo.isFourOfKind(oldCombo) && Combo.isFourOfKind(combo))){
			
				console.log(oldCombo.hand[0].value + " " + combo.hand[0].value);
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
				console.log('check');
			this.curCombo = combo;
			// Remove each card in the played combo from the player's hand
			for(var i = 0; i < combo.hand.length; i++){
				this.pHands[this.curPlayer].removeCard(combo.hand[i]);
			}
			this.nextPlayer();
			return true;
		}
		console.log(combo.hand[0].value + " " + combo.hand[0].suit);
		return false;
	}

	nextPlayer(){
		this.curPlayer += 1;
		this.curPlayer %= 4;
	}
	
}

module.exports = Game;
