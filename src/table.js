const cardFunctions = require("./cards")
const helpers = require("./helpers")


module.exports = function(wss){
    /*
    The very existence of this funciton is not good.
    Make the table know the sockets on the table, then you
    do not have to search all sockets on the server.
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

 function Table(name, socket){
    this.name = name;
    this.playerNames = [socket.playerName]
    this.tableValue = null;
    this.players = [socket.id];
    this.president = null;
    this.vicePresident = null;
    this.trash = null;
    this.viceTrash = null;
    this.turn = null;
    this.targetNumberOfPlayers = null;
    this.phase = "round";
    this.lastPlayerWhoPlayedCards = null;
    this.presidentSendCards = null;
    this.vicePresidentSendCards = null;


    this.getPlayersOnTable = function(){
        // gets all the sockets, whose table attribute is equal to the parameter of this function
        let clients = [...wss.clients].filter((socket) => {
            if(socket.hasOwnProperty("table")){
                if(socket.table === this){
                    return true;
                }
            }else{
                return false;
            }
        })
    
        return clients;
    }

    this.getPrivateState = function(){
        return {name: this.name,
            playerNames: this.playerNames,
            tableValue: this.tableValue,
            players: this.players,
            president: this.president,
            vicePresident: this.vicePresident,
            trash: this.trash,
            viceTrash: this.viceTrash,
            turn: this.turn,
            targetNumberOfPlayers: this.targetNumberOfPlayers,
            phase: this.phase,
            lastPlayerWhoPlayedCards: this.lastPlayerWhoPlayedCards
        }
    }

    this.broadcastNewState = function(msg){
        let sockets = this.getPlayersOnTable()

        // do not send the ids to the clients. This does not seem to be a good idea...
        let privateState = this.getPrivateState()
    
        for(let socket of sockets){
            privateState.id = socket.id
            socket.send(JSON.stringify({state:{msg: msg, cards: socket.cards, table: privateState}}))
        }
    }

    this.dealCards = function(){
        let players = this.getPlayersOnTable();
        let thisCards = [...cardFunctions.cardDeck]
        let CardNum = Math.floor(thisCards.length / players.length)
        for(let player of players){
            console.log("Card num: ", CardNum)
            player.cards = [];
            for(let i=0; i<CardNum; i++){
                let card = helpers.choice(thisCards);
                player.cards.push(card);
                helpers.removeItem(card, thisCards);
            }
        player.cards.sort(cardFunctions.compareCards)
        }
    
        for(let player of players){
            console.log("thisCards.length ", thisCards.length)
            if(thisCards.length > 0){
                let card = helpers.choice(thisCards);
                console.log("This card: ", card)
                player.cards.push(card);
                helpers.removeItem(card, thisCards);
            }
        }
    }

    this.nextPlayer = function(){
        for(let i=1; i < this.players.length; i++){
            console.log("nextPlayer")
            console.log("id: ", this.players[(this.turn + i)%this.players.length])
            console.log("was anderes: ", i%this.players.length)
            console.log("table.turn + (i%table.players.length): ", (this.turn + i)%this.players.length)
            console.log("i: ", i)
            if(getPlayerById(this.players[(this.turn + i)%this.players.length]).cards.length > 0){
                this.turn = ((this.turn + i)%this.players.length)
                break;
            }
        }
    }

    this.determineRoles = function(){
        // this function only works if it is called after a player played cards, but it is still this players turn.
    
        let players = this.getPlayersOnTable();
        
        /* 
            TODO:
            this line is a bit stupid!
            Give the table a way to get to the sockets directly, instead of
            this weired way over ids. They are a bit useless anyway.
        */

        let TurnPlayer = getPlayerById(this.players[this.turn])
        
        let PlayersWithCards = players.filter((player) => player.cards.length > 0)
        console.log("players: ", players)
        console.log("PlayersWithCards.length ", PlayersWithCards.length)
        console.log("!table.president ", !this.president)
        console.log("TurnPlayer.cards.length: ",TurnPlayer.cards.length)
        if(TurnPlayer.cards.length === 0){ 
            if(PlayersWithCards.length === 1){
                if(!this.president){
                    this.president = TurnPlayer.id;
                }else if(this.vicePresident !== null){
                    this.viceTrash = TurnPlayer.id;
                }
                this.trash = PlayersWithCards[0].id
            }else{
                if(!this.president){
                    this.president = TurnPlayer.id;
                }else if(!this.vicePresident){
                    this.vicePresident = TurnPlayer.id;
                }
            }
        }
    }

    this.PlayerNumberReached = function(){
        return this.players.length === this.targetNumberOfPlayers
    }

    this.exchangeCardsPresident = function(cards){
        // check if the president really has the cards to exchange?
        let players = this.getPlayersOnTable();
        let president_socket = players.filter((player) => player.id === this.president)[0];
        let trash_socket = players.filter((player) => player.id === this.trash)[0];
        let sortedCards = trash_socket.cards.sort(cardFunctions.compareCards)
        let bestCard = sortedCards[sortedCards.length-1]
        let secondbestCard = sortedCards[sortedCards.length-2]
        console.log("Exchange: ", president_socket.cards)
        console.log(cards)
        let filteredForCardOne = president_socket.cards.filter((card) => card[0] === cards[0][0] && card[1] === cards[0][1])
        let filteredForCardTwo = president_socket.cards.filter((card) => card[0] === cards[1][0] && card[1] === cards[1][1])
        if(filteredForCardOne.length == 1 && filteredForCardTwo.length == 1){
            president_socket.cards = cardFunctions.removeCard(cards[0], president_socket.cards);
            president_socket.cards = cardFunctions.removeCard(cards[1], president_socket.cards)
            trash_socket.cards = cardFunctions.removeCard(bestCard, trash_socket.cards)
            trash_socket.cards = cardFunctions.removeCard(secondbestCard, trash_socket.cards)
            trash_socket.cards.push(cards[0])
            trash_socket.cards.push(cards[1])
            president_socket.cards.push(bestCard)
            president_socket.cards.push(secondbestCard)
        }
    }

    this.exchangeCardsVice = function(cards){
        let players = this.getPlayersOnTable();
        let president_socket = players.filter((player) => player.id === this.vicePresident)[0];
        let trash_socket = players.filter((player) => player.id === this.viceTrash)[0];
        let sortedCards = trash_socket.cards.sort(cardFunctions.compareCards)
        let bestCard = sortedCards[sortedCards.length-1]
        if(president_socket.cards.includes(cards[0])){
            cardFunctions.removeCard(cards[0], president_socket.cards);
            cardFunctions.removeCard(bestCard, trash_socket.cards)
            trash_socket.cards.push(cards[0])
            president_socket.cards.push(bestCard)
        }
    }

}

Table.tableNameAvailable = function(tableName){
    let clients = [...wss.clients].filter((socket) => {
        if(socket.hasOwnProperty("table")){
            if(socket.table.name === tableName){
                return true;
            }
        }else{
            return false;
        }
    })
    if(clients.length > 0){
        return false
    }
    return true
}

Table.getTableByName = function(tableName){
    [...wss.clients].map((socket) => {
        if(socket.hasOwnProbperty("table")){
            if(socket.table.name === tableName){
                return socket.table;
            }
        }
    })
    return null
}

Table.getPlayerOnTableByName = function(tableName){
    // gets all the sockets, whose table name attribute is equal to the parameter of this function

    let clients = [...wss.clients].filter((socket) => {
        if(socket.hasOwnProperty("table")){
            if(socket.table.hasOwnProperty("name")){
                if(socket.table.name === tableName){
                    return true;
                }
            }else{
                return false;
            }
        }   
    })

    return clients;
}

return Table;
}

