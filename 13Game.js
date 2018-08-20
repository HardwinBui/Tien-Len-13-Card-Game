const Card = require('./Card');
const Combo = require('./Combo');

class Game{
	
	constructor(p1, p2, p3, p4) {		
		this.players = [p1, p2, p3, p4];
		this.curPlayer = 0;
		this.curTurn = 0;
		
		this.pHands = [];
		for (var i = 0; i < 4; i++){
			this.pHands[i] = [];
		}
		
		// Randomly distribute cards to each player
		for(var i = 1; i <= 52; i++){
			var randomPlayer = Math.floor(Math.random() * 4);
			if(this.pHands[randomPlayer].length < 13){
				var card = new Card(i % 13, Math.floor(i / 13));
				this.pHands[randomPlayer].push(card);
				
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
		this.curCombo.addCard(new Card(4, 2));
		this.curCombo.addCard(new Card(4, 3));
		this.curCombo.addCard(new Card(3, 0));
		this.curCombo.addCard(new Card(2, 1));
		this.curCombo.addCard(new Card(2, 1));
		this.curCombo.addCard(new Card(2, 0));
		this.curCombo.printCombo();
		console.log(Combo.isPairBomb(this.curCombo));
		
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
	
	

	
}

module.exports = Game;
