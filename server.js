let express = require("express");
let ws = require("ws");
const path = require("path")
const enableWs = require("express-ws")
const { table } = require("console");
const { create } = require("domain");

const cardFunctions = require("./src/cards")
const helpers = require("./src/helpers")


let app = express()
app.use(express.static(path.join(__dirname, 'build')))
const Ws_Server = enableWs(app)

let wss = Ws_Server.getWss();

const Table = require("./src/table")(wss)
const Player = require("./src/player")(wss)

app.get("/", function(req, res){res.sendFile(path.join(__dirname, 'build',"index.html"))})
//app.listen(2000, function(){console.log("Example app listening on port 2000!")})

/*
let WebSocketServer = ws.Server
let wss = new WebSocketServer({port:40510})
*/

// just for keeping track of player Ids...
let playerIds = [0]

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

function getNewplayerId(){
    return Math.min(playerIds.filter((num) => !playerIds.includes(num+1))) + 1;
}

//wss.on("connection", function(ws){
app.ws("/api", function(ws, req){
    
    ws = Player(ws, getNewplayerId())

    console.log("WS: ", ws.id)
    
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
                    console.log(1)
                    return;
                }
                if(!helpers.StringIsAlphaNumeric(msgObj.data.tableName)){
                    console.log(2)
                    ws.send(JSON.stringify({state: {error: "Table name not alphanumeric!"}}))
                    return;
                }

                // make sure table names do not conflict:
                if(!Table.tableNameAvailable(msgObj.data.tableName)){
                    console.log(3)
                    ws.send(JSON.stringify({state: {error: "Table name not available."}}))
                    return;
                }

                // make sure there is no table attached to the socket:
                if(ws.hasOwnProperty("table")){
                    console.log(4)
                    ws.send(JSON.stringify({state: {error: "Socket has table. Cannot create new table"}}))
                    return;
                }

                ws.table = new Table(String(msgObj.data.tableName), ws)
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
                if(!helpers.StringIsAlphaNumeric(msgObj.data.tableName)){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table name not alphanumeric!"}}))
                    return;
                }

                // make sure table already exists:
                let Players = Table.getPlayerOnTableByName(msgObj.data.tableName)
                if(Table.tableNameAvailable(msgObj.data.tableName)){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table not found!"}}))
                    return;
                }

                // if the target number of players is reached: do not allow more players
                if(Players[0].table.PlayerNumberReached()){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table name not available."}}))
                    return;
                }

                ws.JoinTable(msgObj.data.tableName)
                

                // if with the newly joined player the target number of players is reached, start the round:
                if(ws.table.PlayerNumberReached()){
                    ws.table.phase = "round"
                    ws.table.dealCards()

                    ws.table.broadcastNewState("game started");
                    break;
                }
                ws.table.broadcastNewState("Player Joined");
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
                        if(!cardFunctions.isCard(card)){
                            return;
                        }
                    }

                    let newState = ws.playCards(msgObj.data)
                    if(newState.state !== "error" && newState.state !== "passed"){
                        ws.table.determineRoles()
                        if(ws.table.trash !== null){
                            ws.table.dealCards()
                            ws.table.phase = "exchange";
                            ws.table.tableValue = []
                        }else if(ws.table.tableValue[0][0] !== "A"){
                            ws.table.nextPlayer()
                        }
                        ws.table.broadcastNewState("card played");
                    }else if(newState.state === "passed"){
                        ws.table.nextPlayer()
                        ws.table.broadcastNewState("card played");
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
                        if(!cardFunctions.isCard(card)){
                            return;
                        }
                    }

                    if(ws.table.president === ws.id && !ws.table.presidentSendCards){
                        ws.table.exchangeCardsPresident(msgObj.data)
                        ws.table.presidentSendCards = true;
                        if(ws.table.vicePresident === null){
                            ws.table.vicePresidentSendCards = true;
                        }
                    }else if(ws.table.vicePresident === ws.id && !ws.table.vicePresidentSendCards){
                        ws.table.exchangeCardsVice(msgObj.data);
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
                        ws.table.broadcastNewState("game started");
                    }
                }
                console.log(ws.table)
                break;


            case("changeName"):
                if(!helpers.StringIsAlphaNumeric(msgObj.data)){
                    ws.send(JSON.stringify({state: {error: "Player name not alphanumeric!"}}))
                    return;
                }

                ws.playerName = String(msgObj.data)
                console.log(ws.playerName)
                ws.send(JSON.stringify({state: {success: "Player name changed to: "+ ws.playerName}}))
                if(ws.table){
                    let idx = ws.table.players.indexOf(ws.id)
                    ws.table.playerNames[idx] = ws.playerName
                    ws.table.broadcastNewState("change name");
                }
                break;
        }
    });

    ws.on("close", function(){
        if(ws.table){
            ws.leaveTable()
        }
        
        remove(ws.id)
    })

    ws.send("Connection established")
})


app.listen(3000);