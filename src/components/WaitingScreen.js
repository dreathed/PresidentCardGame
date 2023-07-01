import React from 'react';
import "./styles-components/opening-styles.css";

class WaitingScreen extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      let players = this.props.players.map((player) => <p>{player}</p>)
      console.log(this.props.players)
        return(
        <div id="WaitingScreen">
          <header>
            <h4>Table Name:</h4>
            <h4>{this.props.table.name}</h4>
            <h1>Waiting for other players</h1>
          </header>
          <div className="PlayerList">
            <p>Other Players</p>
            {players}
          </div>
          <nav>
          </nav>
        </div>
        )
      }
}

export default WaitingScreen;