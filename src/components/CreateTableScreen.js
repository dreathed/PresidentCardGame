import React from 'react';

class CreateTableScreen extends React.Component {

    constructor(props){
      super(props);
  
      this.btn_back = this.btn_back.bind(this);
      this.createTable = this.createTable.bind(this);
    }
  
    createTable(){
      
    }
  
    btn_back(){
      this.props.screenChange(0)
    }
  
    render(){
      return(
      <div id="CreateTableScreen">
        <header>
          <h1>CREATE TABLE</h1>
        </header>
        <div className="MinPlayersDiv">
            <label for="input_min_players">Please choose minimal player number!</label>
            <input id="input_min_players" type="number" min="2" max="10"></input>
        </div>
        <nav>
          <button id="btn_create" onClick={this.createTable}>CREATE TABLE</button>
          <button id="btn_back" onClick={this.btn_back}>BACK</button>
        </nav>
      </div>
      )
    }
  }

  export default CreateTableScreen;
  