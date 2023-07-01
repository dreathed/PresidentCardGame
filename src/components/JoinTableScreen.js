import React from 'react';

class JoinTableScreen extends React.Component {

    constructor(props){
      super(props);
  
      this.btn_back = this.btn_back.bind(this);
      this.joinTable = this.joinTable.bind(this);
    }
  
    btn_back(){
      this.props.screenChange(0)
    }
  
    joinTable(){
      this.props.joinTable(document.getElementById("input_table_name").value)
      
    }
  
    render(){
      return(
      <div id="JoinTableScreen">
        <header>
          <h1>JOIN TABLE</h1>
        </header>
        <div className="TableNameDiv">
            <label for="input_table_name">Please input the name of the table that you want to join!</label>
            <input id="input_table_name" type="text"></input>
        </div>
        <nav>
          <button id="btn_join" onClick={this.joinTable}>JOIN TABLE</button>
          <button id="btn_back" onClick={this.btn_back}>BACK</button>
        </nav>
      </div>
      )
    }
  }

  export default JoinTableScreen;