const cardFunctions = require("./cards")
const helpers = require("./helpers")

module.exports = function(wss){
    /*
        Stupid function: See table.js
    */
    function getPlayerById(id){
        let clients = [...wss.clients].filter((socket) => {
            if(socket.hasOwnProperty("id")){
                if(socket.id === id){
                    return true;
                }else{
                    return false;
                }
            }   
        })
        if(clients.length === 1){
            return clients[0]
        }else{
            // something very weird happend...
            return undefined
        }
    }

    function Player(ws, id){
        // de facto: Player extends websocket.
        ws.playerName = ""
        ws.cards = [];
        ws.id = id;

        ws.playerHasCard = function(card){
            if(!ws.cards){
                return false;
            }else{
                console.log(card)
                let newCards = ws.cards.filter((testCard) => card[0] === testCard[0] && card[1]===testCard[1])
                if(newCards.length === 1){
                    return true;
                }else{
                    return false;
                }
            }
        }

        ws.playCards = function(cards){
            // check if it's possible to play these cards; if yes: play card else not.

            let table = ws.table;

            // its not the players turn...
            if(table.players[table.turn] !== ws.id){
                return {state: "error", msg:"An error occured..."}
            }
            

            // the player passes
            if(!cards.length>0){
                return {state: "passed"};
            }
        
            // check if all cards have the same value. So you cannot tinker with this...
            if(!cards.every((card) => card[0] === cards[0][0])){
                return {state: "error", msg:"An error occured..."}
            }

            // There should be a check for different colors too (there was a bug about this)
        
            // check if the player has all the cards...
            for(let card of cards){
                if(!ws.playerHasCard(card)){
                    return {state: "error", msg:"An error occured..."}
                }
            }

            // normal card play. No special rule in place.
            if( (table.hasOwnProperty("tableValue") && table.tableValue === null) || ((cardFunctions.cardValues.indexOf(table.tableValue[0][0]) < cardFunctions.cardValues.indexOf(cards[0][0]) && table.tableValue.length === cards.length) || table.tableValue[0][0] === "A" || table.lastPlayerWhoPlayedCards === ws.id)){
                table.tableValue = cards;
                for(let card of cards){
                    ws.cards = ws.cards.filter((filterCard) => (filterCard[0] !== card[0] || filterCard[1] !== card[1]))
                }
                
                if(ws.cards.length > 0){
                    table.lastPlayerWhoPlayedCards = ws.id;
                }else{
                    for(let i=table.players.indexOf(ws.id); i<table.players.length; i++){
                        if(getPlayerById(table.players[i%table.players.length]).cards.length > 0){
                            table.lastPlayerWhoPlayedCards = table.players[i%table.players.length];
                            break;
                        }
                    }
                }
                return {state:{cards:ws.cards, table}}
            }else{
                console.log("There was an error!")
                return {state: "error", msg:"An error occured..."}
            }
        }


        ws.JoinTable = function(tablename){
            // associates a socket with a table by setting the table attribute.
            // and adding the name of the player to that table-object.

            if((ws.hasOwnProperty("table") && ws.table.name !== tablename) || !ws.hasOwnProperty("table")){
                let clients = [...wss.clients].filter((socket) => {
                    if(socket.hasOwnProperty("table")){
                        return socket.table.name === tablename;
                    }else{
                        return false;
                    }});
                if(clients.length>0){
                    ws.table = clients[0].table;
                    ws.table.playerNames.push(ws.playerName)
                    ws.table.players.push(ws.id)
                }
            }
        }

        ws.leaveTable = function(){
            // if the player who left is the last one who played:
            // the right to play go to the next player.
            if(ws.table.lastPlayerWhoPlayedCards === ws.id){
                let index = ws.table.players.indexOf(ws.id)
                let next = (index + 1) % ws.table.players.length
                ws.table.lastPlayerWhoPlayedCards = ws.table.players[next]
            }
        
            // remove the socket from all the stuff it was attached to...
            helpers.removeItem(ws.playerName, ws.table.playerNames)
            helpers.removeItem(ws.id, ws.table.players)
        
            delete ws.table;
            // delete: so it is sure, that the table property of the socket always has the correct properties, 
            // if the socket has the table property at all...
            // as opposed to socket.table = null...
        }

        return ws
    }

    return Player
}