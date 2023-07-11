let express = require("express");
let ws = require("ws");
const path = require("path")
const enableWs = require("express-ws")
const { table } = require("console");
const { create } = require("domain");


let app = express()
app.use(express.static(path.join(__dirname, 'build')))
const Ws_Server = enableWs(app)

let wss = Ws_Server.getWss();

app.get("/", function(req, res){res.sendFile(path.join(__dirname, 'build',"index.html"))})
//app.listen(2000, function(){console.log("Example app listening on port 2000!")})

/*
let WebSocketServer = ws.Server
let wss = new WebSocketServer({port:40510})
*/

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


// just for keeping track of player Ids...
let playerIds = [0]

function getNewplayerId(){
    return Math.min(playerIds.filter((num) => !playerIds.includes(num+1))) + 1;
}

function remove(id){
    //removes the player id from the global array of player ids.

    try{
        const idx = playerIds.indexOf(id);
        if(idx > -1){
            playerIds.splice(idx,1);
        }
    }catch(e){
        console.log("Something went wrong in the removal of an id.");
    }
}

function choice(array){
    // helper for random choices, like dealing cards.

    let idx = Math.floor(Math.random() * array.length);
    try{
        return array[idx]
    }catch(e){
        return null
    }
}


function removeCard(card, cardList){
    return cardList.filter((item) => item[0] !==card[0] || item[1] !== card[1])
}


function removeItem(item, array){
    // helper: removes an item from an array.

    const idx = array.indexOf(item);
    if(idx>-1){
        array.splice(idx, 1);
    }
}


function getPlayersOnTable(table){
    // gets all the sockets, whose table attribute is equal to the parameter of this function

    let clients = [...wss.clients].filter((socket) => {
        if(socket.hasOwnProperty("table")){
            if(socket.table === table){
                return true;
            }
        }else{
            return false;
        }
    })

    return clients;
}


function getPlayerOnTableByName(tableName){
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

function getPrivateState(table){
    // this does not really matter. Since we are sending
    // basically all the data anyway.

    return {name: table.name,
        playerNames: table.playerNames,
        tableValue: table.tableValue,
        players: table.players,
        president: table.president,
        vicePresident: table.vicePresident,
        trash: table.trash,
        viceTrash: table.viceTrash,
        turn: table.turn,
        targetNumberOfPlayers: table.targetNumberOfPlayers,
        phase: table.phase,
        lastPlayerWhoPlayedCards: table.lastPlayerWhoPlayedCards
    }
}

function broadcastNewState(table, msg){
    let sockets = getPlayersOnTable(table)

    // do not send the ids to the clients. This does not seem to be a good idea...
    let privateState = getPrivateState(table)
    
    for(let socket of sockets){
        privateState.id = socket.id
        socket.send(JSON.stringify({state:{msg: msg, cards: socket.cards, table: privateState}}))
    }
}


function dealCards(table){
    let players = getPlayersOnTable(table);
    let thisCards = [...cardDeck]
    let CardNum = Math.floor(thisCards.length / players.length)
    for(let player of players){
        console.log("Card num: ", CardNum)
        player.cards = [];
        for(let i=0; i<CardNum; i++){
            let card = choice(thisCards);
            player.cards.push(card);
            removeItem(card, thisCards);
        }
        player.cards.sort(compareCards)
    }
    
    for(let player of players){
        console.log("thisCards.length ", thisCards.length)
        if(thisCards.length > 0){
            let card = choice(thisCards);
            console.log("This card: ", card)
            player.cards.push(card);
            removeItem(card, thisCards);
        }
    }
}


function playerHasCard(socket, card){
    if(!socket.cards){
        return false;
    }else{
        console.log(card)
        let newCards = socket.cards.filter((testCard) => card[0] === testCard[0] && card[1]===testCard[1])
        if(newCards.length === 1){
            return true;
        }else{
            return false;
        }
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


function playCards(socket, cards){
    // check if it's possible to play these cards; if yes: play card else not.
    
    let table = socket.table;

    if(table.players[table.turn] !== socket.id){
        return {state: "error", msg:"An error occured..."}
    }
    
    console.log("THE PLAYER PASSED")

    if(!cards.length>0){
        // the player passes
        return {state: "passed"};
    }

    // check if all cards have the same value. So you cannot tinker with this...
    if(!cards.every((card) => card[0] === cards[0][0])){
        return {state: "error", msg:"An error occured..."}
    }

    // all user input not trustworthy...
    for(let card of cards){
        if(!playerHasCard(socket, card)){
            return {state: "error", msg:"An error occured..."}
        }
    }

    // in case there are already cards on the table:   
    if(table.tableValue){
        if(cardValues.indexOf(table.tableValue[0][0]) < cardValues.indexOf(cards[0][0]) && table.tableValue.length == cards.length && table.tableValue[0][0] !== "A" && table.lastPlayerWhoPlayedCards !== socket.id){
            table.tableValue = cards;
            for(let card of cards){
                socket.cards = socket.cards.filter((filterCard) => (filterCard[0] !== card[0] || filterCard[1] !== card[1]))
            }

            if(socket.cards.length > 0){
                table.lastPlayerWhoPlayedCards = socket.id;
            }else{
                for(let i=table.players.indexOf(socket.id); i<table.players.length; i++){
                    if(getPlayerById(table.players[i%table.players.length]).cards.length > 0){
                        table.lastPlayerWhoPlayedCards = table.players[i%table.players.length];
                        break;
                    }
                }
            }
            
            return {state:{cards:socket.cards, table}}
        }else if(table.tableValue[0][0] === "A" || table.lastPlayerWhoPlayedCards === socket.id){
            table.tableValue = cards;
            for(let card of cards){
                socket.cards = socket.cards.filter((filterCard) => (filterCard[0] !== card[0] || filterCard[1] !== card[1]))
            }
            
            if(socket.cards.length > 0){
                table.lastPlayerWhoPlayedCards = socket.id;
            }else{
                for(let i=table.players.indexOf(socket.id); i<table.players.length; i++){
                    if(getPlayerById(table.players[i%table.players.length]).cards.length > 0){
                        table.lastPlayerWhoPlayedCards = table.players[i%table.players.length];
                        break;
                    }
                }
            }

            return {state:{cards:socket.cards, table}}
        }else{
            return {state: "error", msg:"An error occured..."}
        }
    }else{
        table.tableValue = cards;
            for(let card of cards){
                socket.cards = socket.cards.filter((filterCard) => (filterCard[0] !== card[0] || filterCard[1] !== card[1]))
            }
            
            if(socket.cards.length > 0){
                table.lastPlayerWhoPlayedCards = socket.id;
            }else{
                for(let i=table.players.indexOf(socket.id); i<table.players.length; i++){
                    if(getPlayerById(table.players[i%table.players.length]).cards.length > 0){
                        table.lastPlayerWhoPlayedCards = table.players[i%table.players.length];
                        break;
                    }
                }
            }

            return {state:{cards:socket.cards, table}}
    }
}


function nextPlayer(table){
    for(let i=1; i < table.players.length; i++){
        console.log("nextPlayer")
        console.log("id: ", table.players[(table.turn + i)%table.players.length])
        console.log("was anderes: ", i%table.players.length)
        console.log("table.turn + (i%table.players.length): ", (table.turn + i)%table.players.length)
        console.log("i: ", i)
        if(getPlayerById(table.players[(table.turn + i)%table.players.length]).cards.length > 0){
            table.turn = ((table.turn + i)%table.players.length)
            break;
        }
    }
}


function PlayerNumberReached(table){
    let players = getPlayersOnTable(table)
    return players.length === table.targetNumberOfPlayers
}


function makeTable(tableName, socket){
    return {name: tableName,
            playerNames: [socket.playerName],
            players: [socket.id],
            lastPlayerWhoPlayedCards: null,
            tableValue: null,
            president: null,
            vicePresident: null,
            trash: null,
            viceTrash: null,
            turn: null,
            targetNumberOfPlayers: null,
            phase: "round",
            presidentSendCards: null,
            vicePresidentSendCards: null
        }
}


function JoinTable(tablename, socket){
    // associates a socket with a table by setting the table attribute.
    // and adding the name of the player to that table-object.

    if((socket.hasOwnProperty("table") && socket.table.name !== tablename) || !socket.hasOwnProperty("table")){
        let clients = [...wss.clients].filter((socket) => {
            if(socket.hasOwnProperty("table")){
                return socket.table.name === tablename;
            }else{
                return false;
            }});
        if(clients.length>0){
            socket.table = clients[0].table;
            socket.table.playerNames.push(socket.playerName)
            socket.table.players.push(socket.id)
        }
    }
}

function leaveTable(socket){
    // if the player who left is the last one who played:
    // the right to play go to the next player.
    if(socket.table.lastPlayerWhoPlayedCards === socket.id){
        let index = socket.table.players.indexOf(socket.id)
        let next = (index + 1) % socket.table.players.length
        socket.table.lastPlayerWhoPlayedCards = socket.table.players[next]
    }

    // remove the socket from all the stuff it was attached to...
    removeItem(socket.playerName, socket.table.playerNames)
    removeItem(socket.id, socket.table.players)

    delete socket.table;
    // delete: so it is sure, that the table property of the socket always has the correct properties, 
    // if the socket has the table property at all...
    // as opposed to socket.table = null...
}

function determineRoles(table){
    // this function only works if it is called after a player played cards, but it is still this players turn.

    let players = getPlayersOnTable(table);
    
    //let TurnPlayer = players.filter((player) => player.id === table.lastPlayerWhoPlayedCards)[0]
    let TurnPlayer = getPlayerById(table.players[table.turn])
    let PlayersWithCards = players.filter((player) => player.cards.length > 0)
    console.log("players: ", players)
    console.log("PlayersWithCards.length ", PlayersWithCards.length)
    console.log("!table.president ", !table.president)
    console.log("TurnPlayer.cards.length: ",TurnPlayer.cards.length)
    if(TurnPlayer.cards.length === 0){ 
        if(PlayersWithCards.length === 1){
            if(!table.president){
                table.president = TurnPlayer.id;
            }else if(table.vicePresident !== null){
                table.viceTrash = TurnPlayer.id;
            }
            table.trash = PlayersWithCards[0].id
        }else{
            if(!table.president){
                table.president = TurnPlayer.id;
            }else if(!table.vicePresident){
                table.vicePresident = TurnPlayer.id;
            }
        }
    }
}

function exchangeCardsPresident(cards, table){
    // check if the president really has the cards to exchange?
    let players = getPlayersOnTable(table);
    let president_socket = players.filter((player) => player.id === table.president)[0];
    let trash_socket = players.filter((player) => player.id === table.trash)[0];
    let sortedCards = trash_socket.cards.sort(compareCards)
    let bestCard = sortedCards[sortedCards.length-1]
    let secondbestCard = sortedCards[sortedCards.length-2]
    console.log("Exchange: ", president_socket.cards)
    console.log(cards)
    let filteredForCardOne = president_socket.cards.filter((card) => card[0] === cards[0][0] && card[1] === cards[0][1])
    let filteredForCardTwo = president_socket.cards.filter((card) => card[0] === cards[1][0] && card[1] === cards[1][1])
    if(filteredForCardOne.length == 1 && filteredForCardTwo.length == 1){
        president_socket.cards = removeCard(cards[0], president_socket.cards);
        president_socket.cards = removeCard(cards[1], president_socket.cards)
        trash_socket.cards = removeCard(bestCard, trash_socket.cards)
        trash_socket.cards = removeCard(secondbestCard, trash_socket.cards)
        trash_socket.cards.push(cards[0])
        trash_socket.cards.push(cards[1])
        president_socket.cards.push(bestCard)
        president_socket.cards.push(secondbestCard)
    }
}

function exchangeCardsVice(cards, table){
    let players = getPlayersOnTable(table);
    let president_socket = players.filter((player) => player.id === table.vicePresident)[0];
    let trash_socket = players.filter((player) => player.id === table.viceTrash)[0];
    let sortedCards = trash_socket.cards.sort(compareCards)
    let bestCard = sortedCards[sortedCards.length-1]
    if(president_socket.cards.includes(cards[0])){
        removeCard(cards[0], president_socket.cards);
        removeCard(bestCard, trash_socket.cards)
        trash_socket.cards.push(cards[0])
        president_socket.cards.push(bestCard)
    }
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


//wss.on("connection", function(ws){
app.ws("/api", function(ws, req){  
    ws.playerName = "Harrald Houdini"
    ws.cards = [];
    ws.id = getNewplayerId();
    playerIds.push(ws.id);


    ws.on("message", function (msg){
        let msgObj = JSON.parse(msg);

        // make sure msgObj has a good shape:
        if(!msgObj.hasOwnProperty("data")){
            return;
        }
        if(!msgObj.hasOwnProperty("command")){
            return;
        }

        switch(msgObj.command){
            case("createTable"):
                // make sure object is in good shape:
                if(!msgObj.data.hasOwnProperty("tableName")){
                    return;
                }
                if(!StringIsAlphaNumeric(msgObj.data.tableName)){
                    ws.send(JSON.stringify({state: {error: "Table name not alphanumeric!"}}))
                    return;
                }

                // make sure table names do not conflict:
                let PlayersOnTable = getPlayersOnTable(msgObj.data.tableName)
                if(PlayersOnTable.length > 0){
                    ws.send(JSON.stringify({state: {error: "Table name not available."}}))
                    return;
                }

                // make sure there is no table attached to the socket:
                if(ws.hasOwnProperty("table")){
                    ws.send(JSON.stringify({state: {error: "Socket has table. Cannot create new table"}}))
                    return;
                }

                ws.table = makeTable(String(msgObj.data.tableName), ws)
                ws.table.targetNumberOfPlayers = msgObj.data.numberOfPlayers;
                ws.table.turn = 0;
                console.log(ws.table)
                ws.send(JSON.stringify({state: {msg: "Created Table", data: ws.table}}))
                break;


            case("joinTable"):
            console.log(msgObj)
                // make sure object is in good shape / and is not malicious:
                if(!msgObj.data.hasOwnProperty("tableName")){
                    return;
                }
                if(!StringIsAlphaNumeric(msgObj.data.tableName)){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table name not alphanumeric!"}}))
                    return;
                }

                // make sure table already exists:
                let Players = getPlayerOnTableByName(msgObj.data.tableName)
                if(Players.length <= 0){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table not found!"}}))
                    return;
                }

                // if the target number of players is reached: do not allow more players
                if(PlayerNumberReached(Players[0].table)){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table name not available."}}))
                    return;
                }

                JoinTable(msgObj.data.tableName, ws)
                

                // if with the newly joined player the target number of players is reached, start the round:
                if(PlayerNumberReached(ws.table)){
                    ws.table.phase = "round"
                    dealCards(ws.table)

                    broadcastNewState(ws.table, "game started");
                    break;
                }
                broadcastNewState(ws.table, "Player Joined");
                console.log(ws.table)
                break;


            case("playCards"):
                if(!ws.hasOwnProperty("table")){
                    ws.send(JSON.stringify({state: {error: "Table not available."}}))
                    return;
                }

                if(ws.table.phase === "round"){
                    // check if data has the correct shape...
                    if(!Array.isArray(msgObj.data)){
                        return
                    }
                    if(msgObj.length > 4){
                        // something very weired must have happened...
                        return
                    }
                    for(let card of msgObj.data){
                        if(!isCard(card)){
                            return;
                        }
                    }

                    let newState = playCards(ws, msgObj.data)
                    if(newState.state !== "error" && newState.state !== "passed"){
                        determineRoles(ws.table)
                        if(ws.table.trash !== null){
                            dealCards(ws.table)
                            ws.table.phase = "exchange";
                            ws.table.tableValue = []
                        }else if(ws.table.tableValue[0][0] !== "A"){
                            nextPlayer(ws.table)
                        }
                        broadcastNewState(ws.table, "card played");
                    }else if(newState.state === "passed"){
                        nextPlayer(ws.table)
                        broadcastNewState(ws.table, "card played");
                    }else{
                        console.log(newState)
                    }
                }
                console.log(ws.table)
                break;


            case("sendCards"):
                // check if socket has these attributes...
                // theoretically anymone can send this message, without the socket having the table property...

                console.log("Received SendCards Message")

                if(!ws.hasOwnProperty("table")){
                    ws.send(JSON.stringify({state: {error: "Table not available."}}))
                    return;
                }

                if(ws.table.phase === "exchange"){
                    // check if data has the correct shape...
                    if(!Array(msgObj.data)){
                        return
                    }
                    for(let card of msgObj.data){
                        if(!isCard(card)){
                            return;
                        }
                    }

                    if(ws.table.president === ws.id && !ws.table.presidentSendCards){
                        exchangeCardsPresident(msgObj.data, ws.table)
                        ws.table.presidentSendCards = true;
                        if(ws.table.vicePresident === null){
                            ws.table.vicePresidentSendCards = true;
                        }
                    }else if(ws.table.vicePresident === ws.id && !ws.table.vicePresidentSendCards){
                        exchangeCardsVice(msgObj.data, ws.table);
                        ws.table.vicePresidentSendCards = true;
                    }
                    if(ws.table.presidentSendCards && ws.table.vicePresidentSendCards){
                        // start a new round.
                        ws.table.turn = ws.table.players.indexOf(ws.table.president);
                        ws.table.lastPlayerWhoPlayedCards = null;
                        ws.table.tableValue = null;
                        ws.table.president = null;
                        ws.table.vicePresident = null;
                        ws.table.trash = null;
                        ws.table.viceTrash = null;
                        ws.table.phase = "round"
                        ws.table.presidentSendCards = null;
                        ws.table.vicePresidentSendCards = null;
                        broadcastNewState(ws.table, "game started");
                    }
                }
                console.log(ws.table)
                break;


            case("changeName"):
                if(!StringIsAlphaNumeric(msgObj.data)){
                    ws.send(JSON.stringify({state: {error: "Player name not alphanumeric!"}}))
                    return;
                }

                ws.playerName = String(msgObj.data)
                console.log(ws.playerName)
                ws.send(JSON.stringify({state: {success: "Player name changed to: "+ ws.playerName}}))
                if(ws.table){
                    let idx = ws.table.players.indexOf(ws.id)
                    ws.table.playerNames[idx] = ws.playerName
                    broadcastNewState(ws.table, "change name");
                }
                break;
        }
    });

    ws.on("close", function(){
        if(ws.table){
            leaveTable(ws)
        }
        
        remove(ws.id)
    })

    ws.send("Connection established")
})


app.listen(2000);