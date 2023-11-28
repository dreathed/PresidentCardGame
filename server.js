
const { PresidentCardGame } = require("./src/CardGames/PresidentCardGame");
const { PresidentPlayer } = require("./src/CardGames/Players/PresidentPlayer");
let express = require("express");
let ws = require("ws");
const path = require("path")
const enableWs = require("express-ws")


const helpers = require("./src/helpers")

let app = express()
app.use(express.static(path.join(__dirname, 'build')))
const Ws_Server = enableWs(app)

let wss = Ws_Server.getWss();

app.get("/", function(req, res){res.sendFile(path.join(__dirname, 'build',"index.html"))})

let games = [];
app.ws("/api", function(ws, req){
    
    ws.on("message", async function (msg){
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
                if(false){
                    console.log(3)
                    ws.send(JSON.stringify({state: {error: "Table name not available."}}))
                    return;
                }

                // make sure there is no table attached to the socket:
                if(false){
                    console.log(4)
                    ws.send(JSON.stringify({state: {error: "Socket has table. Cannot create new table"}}))
                    return;
                }
                let newGame = new PresidentCardGame(msgObj.data.numberOfPlayers, msgObj.data.tableName);
                
                games.push(newGame);
                let player = new PresidentPlayer(ws, newGame.deck, newGame.eventReciever);
                await newGame.addPlayer(player);
                console.log(ws.table)
                ws.send(JSON.stringify({state: {msg: "Created Table", data: {
                    name: newGame.tableName,
                    playerNames: newGame.players.map((player) => player.name),
                    tableValue: newGame.tableValue,
                    president: newGame.president,
                    vicePresident: newGame.vicePresident,
                    trash: newGame.trash,
                    viceTrash: newGame.viceTrash,
                    turn: newGame.turnIndex,
                    targetNumberOfPlayers: newGame.targetNumberOfPlayers,
                    phase: newGame.phase,
                    AllEligiblePlayersPassed: newGame.AllEligiblePlayersPassed()
                }}}))
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
                let searchedGame = games.filter((elem) => elem.tableName == msgObj.data.tableName)
                console.log(games)
                if(searchedGame.length == 0){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table not found!"}}))
                    return;
                }

                // if the target number of players is reached: do not allow more players
                if(searchedGame[0].targetNumberOfPlayers == searchedGame[0].players.length){
                    ws.send(JSON.stringify({state: {msg: "error", error: "Table name not available."}}))
                    return;
                }

                let Newplayer = new PresidentPlayer(ws,searchedGame[0].deck,searchedGame[0].eventReciever);
                await searchedGame[0].addPlayer(Newplayer);
                

                // if with the newly joined player the target number of players is reached, start the round:
                if(searchedGame[0].targetNumberOfPlayers == searchedGame[0].players.length){
                    searchedGame[0].phase = "round"
                    let p = searchedGame[0].runGame();
                    break;
                }
                //ws.table.broadcastNewState("Player Joined");
                //console.log(ws.table)
                break;

            case("changeName"):
                if(!helpers.StringIsAlphaNumeric(msgObj.data)){
                    ws.send(JSON.stringify({state: {error: "Player name not alphanumeric!"}}))
                    return;
                }

                ws.playerName = String(msgObj.data)
                ws.send(JSON.stringify({state: {success: "Player name changed to: "+ ws.playerName}}))
                
                break;
        }
    });

    ws.on("close", function(){
    })

    ws.send("Connection established");
})


app.listen(3000);