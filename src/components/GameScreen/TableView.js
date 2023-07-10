import React from 'react';
import {clubs, spades, hearts, diamonds} from '../../svgs.js';

class TableView extends React.Component {
    constructor(props){
      super(props)
      this.makeCards = this.makeCards.bind(this)
      this.cards = this.props.tableValue.map(this.makeCards)
      if(this.props.table.phase === "exchange"){
        this.props.table.tableValue = []
      }
    }


    makeCards(args){
      const color = args[1];
      const value = args[0];
      switch(color){
        case("H"):
          return <div key={String(value)+color} className="card" value={value} color={color}><span className="cardvalue red"></span>{value}<span className="cardcolor">{hearts}</span></div>
        case("D"):
          return <div key={String(value)+color} className="card" value={value} color={color}><span className="cardvalue red"></span>{value}<span className="cardcolor">{diamonds}</span></div>
        case("S"):
          return <div key={String(value)+color} className="card" value={value} color={color}><span className="cardvalue red"></span>{value}<span className="cardcolor">{spades}</span></div>
        case("C"):
          return <div key={String(value)+color} className="card" value={value} color={color}><span className="cardvalue red"></span>{value}<span className="cardcolor">{clubs}</span></div>
        default:
          <div key={String(value)+color} className="card" value={value} color={color}><span className="cardvalue red"></span><span className="cardcolor"></span></div>
      }
    }
  
    render(){
      return (
        <div id="TableView">
            {this.cards}
        </div>
      )
    }
  }

  export default TableView;