const Card = require('./Card');

class Combo{
    
    constructor(){
        this.hand = [];
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



    /*
     * Functions to determine what the type of a given combo is
     */
    static isSingle(combo){
        return combo.hand.length == 1;
    }

    static isPair(combo){
        if(combo.hand.length == 2)
            return combo.hand[0].value == combo.hand[1].value;
        return false;
    }

    static isTriple(combo){
        if(combo.hand.length == 3)
            return combo.hand[0].value == combo.hand[1].value && combo.hand[0].value == combo.hand[2].value;
        return false;
    }

    static isRun(combo){
        // a run requires at least three cards
        if(combo.hand.length >= 3){
            var firstVal = combo.hand[0].value;
            for(var i = 1; i < combo.hand.length; i++){
                firstVal -= 1;
                if(firstVal != combo.hand[i].value)
                    return false;
            }
            return true;
        }
        return false;
    }

    static isPairBomb(combo){
        if(combo.hand.length >= 6){
            var firstVal = combo.hand[0].value;
            if(firstVal != combo.hand[1].value)
                return false;

            for(var i = 2; i < combo.hand.length; i += 2){
                firstVal -= 1;
                if(firstVal != combo.hand[i].value || firstVal != combo.hand[i+1].value)
                    return false;
            }
            return true;
        }
        return false;
    }

    static isFourOfKind(combo){
        if(combo.hand.length == 4)
            return combo.hand[0].value == combo.hand[1].value &&
                    combo.hand[2].value == combo.hand[3].value &&
                    combo.hand[0].value == combo.hand[2].value;
        return false
    }

    static isValid(combo){
        return Combo.isSingle(combo) || Combo.isPair(combo) || Combo.isTriple(combo) ||
                Combo.isRun(combo) || Combo.isPairBomb(combo) || Combo.isFourOfKind(combo);
    }
    
    // Checks if there is a 3 of spades in the combo
    static hasThreeOfSpades(combo){
        for(var i = 0; i < combo.hand.length; i++){
            if(combo.hand[i].value == 0 && combo.hand[i].suit == 0)
                return true;
        }
        return false;
    }
    
    // Returns the amount of 2 cards in the combo
    static getAmtOfTwos(combo){
        var twoAmt = 0;
        for(var i = 0; i < combo.hand.length; i++){
            if(combo.hand[i].value == 12)
                twoAmt += 1;
        }
        return twoAmt;
    }

    // Prints the current combo for debugging
    printCombo(){
        for(var i = 0; i < this.hand.length; i++){
            console.log(this.hand[i].value + " " + this.hand[i].suit);
        }
    }
}

module.exports = Combo;
