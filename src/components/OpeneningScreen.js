import React from 'react';
import "./styles-components/opening-styles.css";

class OpeningScreen extends React.Component {
    constructor(props){
      super(props);
      this.createTable = this.createTable.bind(this);
      this.testForPlayerName = this.testForPlayerName.bind(this);
      this.joinTable = this.joinTable.bind(this);
    }
  
  
    testForPlayerName(){
      const playerName = document.getElementById("input_name").value;
      if(!playerName){
        window.alert("Please choose a name. Names may contain lower and upper case letters, number and spaces. Names may not be empty!")
        return false;
      }else{
        return playerName;
      }
    }
  
    createTable(evt){
      if(!this.testForPlayerName()){
        return
      }else{
        this.props.setPlayerName(this.testForPlayerName())
  
        //for tests only:
        this.props.screenChange(3)
  
        //this is the real line:
        //this.props.screenChange(1)
      }
    }
  
    joinTable(){
      if(!this.testForPlayerName()){
        return
      }else{
        this.props.setPlayerName(this.testForPlayerName())
        this.props.screenChange(2)
      }
    }
  
    render(){
      return(
      <div id="openingScreen">
        <header>
        <h1>
            <span>W</span>
            <span>E</span>
            <span>L</span>
            <span>C</span>
            <span>O</span>
            <span>M</span>
            <span>E</span>
            <br></br>
            <br></br>
            <span>M</span>
            <span>R</span>
            <span>.</span>
            <br></br>
            <span>P</span>
            <span>R</span>
            <span>E</span>
            <span>S</span>
            <span>I</span>
            <span>D</span>
            <span>E</span>
            <span>N</span>
            <span>T</span>
            <br></br>
        </h1>
        </header>
        <div className="PlayerNameEnter">
          <form>
          <label for="input_name">PLEASE ENTER YOUR NAME</label>
            <input id="input_name" type="text" placeholder='Willie Nelson' required></input>
          </form>
            
        </div>
        <nav className='button-container'>
          <button id="btn_create" onClick={this.createTable}>CREATE TABLE</button>
          <button if="btn_join" onClick={this.joinTable}>JOIN TABLE</button>
        </nav>
      </div>
      )
    }
  }

  export default OpeningScreen;