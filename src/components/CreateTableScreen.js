import React from 'react';

class CreateTableScreen extends React.Component {

    constructor(props){
      super(props);
  
      this.btn_back = this.btn_back.bind(this);
      this.createTable = this.createTable.bind(this);
    }
  
    createTable(){
      let numberOfPlayers = document.getElementById("input_min_players").value;
      let name = document.getElementById("input_tableName").value;
      let result = this.props.createTable(name, numberOfPlayers)
    }
  
    btn_back(){
      this.props.screenChange(0)
    }
  
    render(){
      return(
      <div id="CreateTableScreen">
        <header>
          <h1>
            <span>C</span>
            <span>R</span>
            <span>E</span>
            <span>A</span>
            <span>T</span>
            <span>E</span>
            <br></br>
            <span>T</span>
            <span>A</span>
            <span>B</span>
            <span>L</span>
            <span>E</span>
          </h1>
        </header>
        <div className="MinPlayersDiv">
            <label for="input_min_players">Please choose minimal player number!</label>
            <input id="input_min_players" type="number" min="2" max="10"></input>
        </div>
        <div className="TableNameDiv">
            <label for="input_tableName">Please give your Table a name</label>
            <input id="input_tableName" type="text"></input>
        </div>
        <nav className='button-container'>
          <button id="btn_create" onClick={this.createTable}>CREATE TABLE</button>
          <button id="btn_back" onClick={this.btn_back}>BACK</button>
        </nav>
      </div>
      )
    }
  }

  export default CreateTableScreen;
  