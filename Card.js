class Card{
	
	constructor(value, suit){
		this.value = value;
		this.suit = suit;
	}
	
	isEquals(card) {
		return this.value == card.value && this.suit == card.suit;
	}
	
}

module.exports = Card;