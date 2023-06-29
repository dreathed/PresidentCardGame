import logo from './logo.svg';
import React from 'react';
import './App.css';

import unmountComponentAtNode from 'react-dom';
import OpeningScreen from './components/OpeneningScreen'
import CreateTableScreen from './components/CreateTableScreen'
import JoinTableScreen from './components/JoinTableScreen'
import GameScreen from './components/GameScreen/GameScreen'



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {"screen": 0, "playerName": undefined, "table": null}

    this.ws = new WebSocket("ws://localhost:2000/api");

    this.screenChange = this.screenChange.bind(this)
    this.setPlayerName = this.setPlayerName.bind(this)
  }

  setPlayerName(name){
    this.setState({"playerName": String(name)})
    console.log("Send to socket")
    this.ws.send(JSON.stringify({command: "changeName", data: name}))
  }


  screenChange(screen){
    this.setState({"screen": screen})
  }


  componentDidMount(){
    this.ws.onmessage = function(msg){
      console.log("Received a message from the server: "+msg.data)

      //let data = JSON.parse(msg.data);
      
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
        screen_view = <CreateTableScreen screenChange={this.screenChange}></CreateTableScreen>
        break;
      case(2):
        screen_view = <JoinTableScreen screenChange={this.screenChange}></JoinTableScreen>
        break;
      case(3):
        screen_view = <GameScreen screenChange={this.screenChange} table={{name: "TheFunnyGroup"}}></GameScreen>
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
