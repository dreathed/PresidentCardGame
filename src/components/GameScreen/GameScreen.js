import React from 'react';
import TableView from './TableView'
import CardFan from './CardFan'

class CardSelector extends React.Component {
    constructor(props){
        super(props)    
        this.cardTimeout = null;
        this.cardMouseDown = null;
        this.cardPageX = null;  
        this.selectCard = this.selectCard.bind(this);

        this.handleCardPointerDown = this.handleCardPointerDown.bind(this);
        this.handleCardPointerUp = this.handleCardPointerUp.bind(this);
        this.handleCardPointerMove = this.handleCardPointerMove.bind(this);
        this.handleCardDrop = this.handleCardDrop.bind(this);

        this.handleDropPointereOver = this.handleDropPointereOver.bind(this);
    }

    componentDidMount(){
        let cards = document.querySelectorAll(".card")
        for(let card of cards){
            card.addEventListener("pointerdown", this.handleCardPointerDown);
            card.addEventListener("pointermove", this.handleCardPointerMove);
            card.addEventListener("pointerup", this.handleCardPointerUp);
        }

        let dropArea = document.getElementById("dropArea");
        dropArea.addEventListener("pointerover", this.handleDropPointereOver);
        dropArea.addEventListener("pointerup", this.handleCardDrop);
    }

    componentDidUpdate(){
        this.componentDidMount()
    }

    handleCardPointerDown(evt){
        this.cardTimeout = window.setTimeout(this.selectCard, 1000, evt.currentTarget.getAttribute("value"));
        if(!this.cardPageX){
          this.cardPageX = evt.pageX;
        }
        this.cardMouseDown = evt.currentTarget;
      }

    handleCardPointerUp(evt){
        let dragoverElem = document.elementFromPoint(evt.pageX - window.pageXOffset, evt.pageY - window.pageYOffset);
        if(dragoverElem.getAttribute("id") === "dropArea"){
            this.handleCardDrop(evt)
        }
        
        if(this.cardTimeout){
          window.clearTimeout(this.cardTimeout);
          this.cardTimeout = null;
          this.cardPageX = null;
        }

        const selected = document.querySelectorAll(".selected");
        if(selected){
          for(let card of selected){
            card.classList.remove("selected")
            this.props.setSelectedCards(null);
          }
        }

        this.cardMouseDown = null;
      }

    handleCardPointerMove(evt){
        evt.preventDefault();
        let dragoverElem = document.elementFromPoint(evt.pageX - window.pageXOffset, evt.pageY - window.pageYOffset);
        if(dragoverElem.getAttribute("id") === "dropArea"){
            this.handleDropPointereOver(evt)
        }
        if(this.cardPageX){
          if(Math.abs(this.cardPageX - evt.pageX) > 100){
            window.clearTimeout(this.cardTimeout);
            this.cardTimeout = null;
          }
        }
      }

    handleCardDrop(evt){
        if(this.props.selectedCards){
          this.props.playCards(this.props.selectedCards);
        }
      }

    handleDropPointereOver(evt){
        if(this.cardMouseDown){
            this.selectCard(this.cardMouseDown.getAttribute("value"));
        }
    }

    selectCard(cardValue){
        /*
          This is not good.
          There should be a method to select how many cards you want to play
          if there is an option. When there is no option, the amout should be
          selected automatically.
        */


        let all_of_value = document.querySelectorAll(".card[value='"+cardValue+"']");
        if(this.props.tableValue.length > 0){
          all_of_value = [...all_of_value].slice(0,this.props.tableValue.length)
        }
        
        console.log("select Cards: ", all_of_value)
        for(let card of all_of_value){
          card.classList.add("selected");
        }
        this.props.setSelectedCards(all_of_value);
      }

    render(){
        return (
            <div id="dragArea">
                <div id="dropArea"></div>
            </div>
        )
    }
}


class GameScreen extends React.Component {
    constructor(props){
      super(props)
      this.state = {selectedCards: null, selectedCardsDraggedOverTable: false, cards: this.props.cards, tableValue: this.props.table.tableValue}
  
      this.playCards = this.playCards.bind(this);
      this.setSelectedCards = this.setSelectedCards.bind(this);
    }
  
    setSelectedCards(cards){
      this.setState({selectedCards: cards});
    }
  
    playCards(cards){
      let newCards = [...cards].map(card => [card.getAttribute("value"), card.getAttribute("color")])
      this.props.playCards(newCards)
      /*
        try{
            let value = cards[0].getAttribute("value");
            this.setState((state) => {
                return {cards: state.cards.filter((card) => card[0] != value)}
            })
        }catch(e){
            console.log(e)
        }
        */
    }
  
    componentDidMount(){
    }

    componentDidUpdate(){
    }
    
    render(){
      console.log("render: ", String(this.props.cards))
      return (
        <div id="GameScreen">
          <header>Table Name: {this.props.table.name}</header>
          <TableView key={this.props.table.tableValue} tableValue={this.props.table.tableValue}></TableView>
          <CardFan cards={this.props.cards} key={String(this.props.cards)}></CardFan>
          <CardSelector setSelectedCards={this.setSelectedCards} playCards={this.playCards} selectedCards={this.state.selectedCards} tableValue={this.props.table.tableValue} key={String(this.state.selectedCards)}></CardSelector>
        </div>
      )
    }
  }
  
export default GameScreen;  