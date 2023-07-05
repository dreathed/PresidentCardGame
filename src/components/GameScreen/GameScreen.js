import React from 'react';
import TableView from './TableView'
import CardFan from './CardFan'


class PassBtn extends React.Component {
  constructor(props){
    super(props)

    this.pass = this.pass.bind(this);
  }

  pass(){
    this.props.playCards([])
  }

  render(){
    return (
      <div id="PassBtn">
        <button onClick={this.pass}><span>P</span><span>A</span><span>S</span><span>S</span></button>
      </div>
    )
  }
}

class CardSelector extends React.Component {
    constructor(props){
        super(props)    
        this.cardTimeout = null;
        this.cardMouseDown = null;
        this.cardPageX = null;  
        this.selectCard = this.selectCard.bind(this);
        this.cardAmount = 0

        this.handleCardPointerDown = this.handleCardPointerDown.bind(this);
        this.handleCardPointerUp = this.handleCardPointerUp.bind(this);
        this.handleCardPointerMove = this.handleCardPointerMove.bind(this);
        this.handleCardDrop = this.handleCardDrop.bind(this);

        this.handleDropPointereOver = this.handleDropPointereOver.bind(this);
        this.handleDropAreaPointerMove = this.handleDropAreaPointerMove.bind(this)
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

        let dropArea = document.getElementById("dropArea");
        dropArea.addEventListener("pointermove", this.handleDropAreaPointerMove);
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
        console.log("set card mouse down null")
        this.cardMouseDown = null;

        let dropArea = document.getElementById("dropArea");
        dropArea.removeEventListener("pointermove", this.handleDropAreaPointerMove);
      }

    handleCardPointerMove(evt){
        evt.preventDefault();
        evt.stopPropagation()
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

    handleDropAreaPointerMove(evt){
      let width = document.body.clientWidth / 8
      console.log("this.cardMouseDown: ", this.cardMouseDown)
      console.log("handleDropAreaPointerMove")
        if(this.cardMouseDown){
          if(evt.pageX <= width){
            this.cardAmount = 0
          }else if(evt.pageX <= width*2){
            this.cardAmount = 1
          }else if(evt.pageX <= width*3){
            this.cardAmount = 2
          }else if(evt.pageX <= width*4){
            this.cardAmount = 3
          }else if(evt.pageX <= width*5){
            this.cardAmount = 4
          }
          console.log(this.cardAmount)
          this.selectCard(this.cardMouseDown.getAttribute("value"));
        }
    }

    handleCardDrop(evt){
        if(this.props.selectedCards){
          this.props.playCards(this.props.selectedCards);
          let dropArea = document.getElementById("dropArea");
        dropArea.removeEventListener("pointermove", this.handleDropAreaPointerMove);
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
          //all_of_value = [...all_of_value].slice(0,this.props.tableValue.length)

        }

        all_of_value = [...all_of_value].slice(0,this.cardAmount)
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
          <CardSelector setSelectedCards={this.setSelectedCards} playCards={this.playCards} selectedCards={this.state.selectedCards} tableValue={this.props.table.tableValue}></CardSelector>
          <PassBtn playCards={this.props.playCards}></PassBtn>
        </div>
      )
    }
  }
  
export default GameScreen;  