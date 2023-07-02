import logo from './logo.svg';
import React from 'react';
import './App.css';

import unmountComponentAtNode from 'react-dom';
import OpeningScreen from './components/OpeneningScreen'
import CreateTableScreen from './components/CreateTableScreen'
import JoinTableScreen from './components/JoinTableScreen'
import GameScreen from './components/GameScreen/GameScreen'
import WaitingScreen from './components/WaitingScreen'



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {"screen": 0, "playerName": undefined, "table": null}

    this.ws = new WebSocket("ws://localhost:2000/api");

    this.screenChange = this.screenChange.bind(this);
    this.setPlayerName = this.setPlayerName.bind(this);
    this.createTable = this.createTable.bind(this);
    this.joinTable = this.joinTable.bind(this);
  }

  setPlayerName(name){
    this.setState({"playerName": String(name)})
    console.log("Send to socket")
    this.ws.send(JSON.stringify({command: "changeName", data: name}))
  }


  createTable(tablename,number_of_players){
    console.log("try to create table...")
    this.ws.send(JSON.stringify({command: "createTable", data: {numberOfPlayers: Number(number_of_players), tableName: tablename}}))
  }


  joinTable(tablename){
    this.ws.send(JSON.stringify({command: "joinTable", data: {tableName: tablename}}))
  }

  screenChange(screen){
    this.setState({"screen": screen})
  }


  componentDidMount(){
    let component = this;
    this.ws.onmessage = function(msg){
      console.log("Received a message from the server: "+msg.data)

      let msgObj = JSON.parse(msg.data);

      switch(msgObj.state.msg){
        case("Created Table"):
          component.setState({"screen": 4, table: msgObj.state.data})
          break;
        case("Player Joined"):
          component.setState({"screen": 4, "table": msgObj.state.table})
          break;
        case("game started"):
          component.setState({"screen": 3, "table": msgObj.state.table, "cards": msgObj.state.cards})
        default:
          console.log("No action taken.")
      }
    }
  }


  render() {
    console.log(this.state)
    let screen_view;
    switch(this.state.screen){
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
        screen_view = <GameScreen screenChange={this.screenChange} table={this.state.table} cards={this.state.cards}></GameScreen>
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
