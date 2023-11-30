import React from 'react';
import './App.css';

import OpeningScreen from './components/OpeneningScreen'
import CreateTableScreen from './components/CreateTableScreen'
import JoinTableScreen from './components/JoinTableScreen'
import GameScreen from './components/GameScreen/GameScreen'
import WaitingScreen from './components/WaitingScreen'
import InstructionsScreen from './components/InstructionsScreen';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {"screen": -1, "playerName": undefined, "table": null}


    this.ws = new WebSocket("wss://presidentcardgame.glitch.me/api");

    //this.ws = new WebSocket("ws://localhost:3000/api");

    this.screenChange = this.screenChange.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);
    this.createTable = this.createTable.bind(this);
    this.joinTable = this.joinTable.bind(this);
    this.playCards = this.playCards.bind(this);
    this.sendCards = this.sendCards.bind(this);
    this.setTableValue = this.setTableValue.bind(this);
  }

  setPlayerName(name){
    this.setState({"playerName": String(name)})
    this.ws.send(JSON.stringify({command: "changeName", data: name}))
  }


  createTable(tablename,number_of_players){
    this.ws.send(JSON.stringify({command: "createTable", data: {numberOfPlayers: Number(number_of_players), tableName: tablename}}))
  }


  joinTable(tablename){
    this.ws.send(JSON.stringify({command: "joinTable", data: {tableName: tablename}}))
  }

  screenChange(screen){
    this.setState({"screen": screen})
  }

  playCards(cards){
    this.ws.send(JSON.stringify({command: "playCards", data: cards}))
  }

  sendCards(cards){
    this.ws.send(JSON.stringify({command: "SEND", data: cards}))
  }

  setTableValue(value){
    let newTable = structuredClone(this.state.table);
    newTable.tableValue = value;
    console.log("newTable: ", newTable)
    let newCards = this.state.cards.filter((card) => {
      for(let valueCard of value){
        return !(card[0] === valueCard[0] && card[1] === valueCard[1])
      }
    })
    this.setState({table: newTable, cards: newCards})
  }


  componentDidMount(){
    let component = this;
    this.ws.onmessage = function(msg){
      console.log("Received a message from the server: "+msg.data)
      let msgObj;
      try{
        msgObj = JSON.parse(msg.data);
      }catch(e){
        console.log("Error in data: ", msg.data)
        throw e;
      }

      switch(msgObj.state.msg){
        case("Created Table"):
          component.setState({"screen": 4, table: msgObj.state.data})
          break;
        case("Player Joined"):
          component.setState({"screen": 4, "table": msgObj.state.table})
          break;
        case("game started"):
          if(msgObj.state.table.tableValue === null){
            msgObj.state.table.tableValue = []
          }
          component.setState({"screen": 3, "table": msgObj.state.table, "cards": msgObj.state.cards})
          break;
        case("card played"):
          if(msgObj.state.table.tableValue === null){
            msgObj.state.table.tableValue = []
          }
          component.setState({"table": msgObj.state.table, "cards": msgObj.state.cards})
          break;
        default:
          console.log("No action taken.")
      }
    }
  } 


  render() {
    console.log(this.state)
    let screen_view;
    switch(this.state.screen){
      case(-1):
        screen_view = <InstructionsScreen screenChange={this.screenChange}></InstructionsScreen>
        break;
      case(0):
        screen_view = <OpeningScreen screenChange={this.screenChange} setPlayerName={this.setPlayerName}></OpeningScreen>
        break;
      case(1):
        screen_view = <CreateTableScreen screenChange={this.screenChange} createTable={this.createTable}></CreateTableScreen>
        break;
      case(2):
        screen_view = <JoinTableScreen screenChange={this.screenChange} joinTable={this.joinTable}></JoinTableScreen>
        break;
      case(3):
        screen_view = <GameScreen setTableValue={this.setTableValue} sendCards={this.sendCards} name={this.state.playerName} screenChange={this.screenChange} table={this.state.table} cards={this.state.cards} playCards={this.playCards}></GameScreen>
        break;
      case(4):
        screen_view = <WaitingScreen screenChange={this.screenChange} table={this.state.table} players={this.state.table.playerNames}></WaitingScreen>
        break;
      default:
        screen_view = <OpeningScreen screenChange={this.screenChange}></OpeningScreen>
    }

    return (
      <div className="App" id="App">
        {screen_view}
      </div>
    );
  }
}

export default App;
