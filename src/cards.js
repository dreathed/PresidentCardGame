let cardValues = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
let cardColors = ["D", "H", "S", "C"];
let cardDeck = [];

for(let value of cardValues){
    for(let color of cardColors){
        cardDeck.push([value, color])
    }
}

function compareCards(a, b){
    if(cardValues.indexOf(a[0])!==cardValues.indexOf(b[0])){
        return cardValues.indexOf(a[0]) - cardValues.indexOf(b[0])
    }else{
        return cardColors.indexOf(a[1]) - cardColors.indexOf(b[1])
    }
}

function removeCard(card, cardList){
    return cardList.filter((item) => item[0] !==card[0] || item[1] !== card[1])
}

function isCard(card){
    if(!Array.isArray(card)){
        return false;
    }
    if(!cardValues.includes(card[0])){
        return false;
    }
    if(!cardColors.includes(card[1])){
        return false;
    }
    if(!card.length === 2){
        return false;
    }
    return true;
}

module.exports.cardValues = cardValues
module.exports.cardColors = cardColors
module.exports.cardDeck = cardDeck
module.exports.compareCards = compareCards
module.exports.removeCard = removeCard
module.exports.isCard = isCard