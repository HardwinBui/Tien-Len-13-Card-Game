const Card = require('./Card');

class Combo{
	
	constructor(){
		this.hand = [];
		//[card];
	}
	
	// Adds a card to the current combo with order of greatest to least
	addCard(card){
		var isAdded = false;
		for(var i = 0; i < this.hand.length; i++){
			if(card.value > this.hand[i].value){
				this.hand.splice(i, 0, card);
				isAdded = true;
				break;
			}
			else if(card.value == this.hand[i].value){
				if(card.suit > this.hand[i].suit){
					this.hand.splice(i, 0, card);
					isAdded = true;
					break;
				}
			} 
		}
		
		if(!isAdded){	
			this.hand.push(card);
		}
	}
	
	// Removes a card from the combo
	removeCard(card){
		for(var i = 0; i < this.hand.length; i++){
			if(this.hand[i].isEquals(card)){
				this.hand.splice(i, 1);
				break;
			}
		}
	}
	
	// Prints the current combo for debugging
	printCombo(){
		for(var i = 0; i < this.hand.length; i++){
			console.log(this.hand[i].value + " " + this.hand[i].suit);
		}
	}
}

module.exports = Combo;