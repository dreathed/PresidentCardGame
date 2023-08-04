function choice(array){
    // helper for random choices, like dealing cards.

    let idx = Math.floor(Math.random() * array.length);
    try{
        return array[idx]
    }catch(e){
        return null
    }
}

function removeItem(item, array){
    // helper: removes an item from an array.

    const idx = array.indexOf(item);
    if(idx>-1){
        array.splice(idx, 1);
    }
}

function StringIsAlphaNumeric(str){
    if(typeof str !== "string"){
        return false;
    }else{
        let Regex = /^[A-Za-z0-9\s]*$/
        if(str.match(Regex)){
            return true;
        }else{
            return false;
        }
    }
}


module.exports.choice = choice
module.exports.removeItem = removeItem
module.exports.StringIsAlphaNumeric = StringIsAlphaNumeric