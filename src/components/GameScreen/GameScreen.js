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
      console.log(evt)
        let dragoverElem = document.elementFromPoint(evt.pageX, evt.pageY);
        console.log(dragoverElem)
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

        let dropArea = document.getElementById("dropArea");
        dropArea.removeEventListener("pointermove", this.handleDropAreaPointerMove);
      }

    handleCardPointerMove(evt){
        let dragoverElem = document.elementFromPoint(evt.pageX, evt.pageY);
        if(dragoverElem.getAttribute("id") === "dropArea"){
          this.handleDropAreaPointerMove(evt)
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
      
      if(this.props.tableValue.length === 0 ||
        this.props.table.lastPlayerWhoPlayedCards === this.props.table.id){
        let width = document.body.clientWidth / 8
        let amount = document.querySelectorAll(".card[value='"+this.cardMouseDown.getAttribute("value")+"']").length;
        if(this.cardMouseDown){
          if(evt.pageX <= width){
            this.cardAmount = Math.min(0, amount)
          }else if(evt.pageX <= width*2){
            this.cardAmount = Math.min(1, amount)
          }else if(evt.pageX <= width*3){
            this.cardAmount = Math.min(2, amount)
          }else if(evt.pageX <= width*4){
            this.cardAmount = Math.min(3, amount)
          }else if(evt.pageX <= width*5){
            this.cardAmount = Math.min(4, amount)
          }
          this.selectCard(this.cardMouseDown.getAttribute("value"));
        }
        }else if(this.props.tableValue.length > 0){
          this.cardAmount = this.props.tableValue.length;
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
        let all_of_value = document.querySelectorAll(".card[value='"+cardValue+"']");

        all_of_value = [...all_of_value].slice(0,this.cardAmount)
        for(let card of all_of_value){
          card.classList.add("selected");
        }

        this.props.setSelectedCards(all_of_value);
      }

    render(){
        return (
            <div id="dragArea">
              <span id="cardAmount" key={this.cardAmount}>{this.cardAmount}</span>
                <div id="dropArea"></div>
            </div>
        )
    }
}



class ExchangeCardSelector extends CardSelector {
  constructor(props){
    super(props)
    this.Cards = []
    if(this.props.table.president === this.props.table.id){
      this.targetLength = 2;
    }else if(this.props.table.vicePresident === this.props.table.id){
      this.targetLength = 1;
    }else{
      this.targetLength = 0;
    }
    
  }

  handleDropAreaPointerMove(evt){
    this.cardAmount = 1;
    console.log("JAPJAPJAP")
  }

  selectCard(){
    console.log("started to select card")
    console.log("this.cardMouseDown: ", this.cardMouseDown)
    if(this.cardMouseDown){
      this.Cards.push([this.cardMouseDown.getAttribute("value"), this.cardMouseDown.getAttribute("color")])
      console.log("this.Cards: ", this.Cards)
      this.props.setTableValue(this.Cards)
      if(this.Cards.length == this.targetLength){
        this.props.sendCards(this.Cards)
      }
    }
  }


  handleDropAreaPointerMove(evt){

  }

  handleDropPointereOver(evt){
    //pass
}

  handleCardPointerUp(evt){
    console.log(evt)
    let dragoverElem = document.elementFromPoint(evt.pageX, evt.pageY);
    console.log(dragoverElem)
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

    let dropArea = document.getElementById("dropArea");
    dropArea.removeEventListener("pointermove", this.handleDropAreaPointerMove);
  }

  handleCardDrop(evt){
    console.log("DROP")
    console.log(evt)
    this.selectCard()
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
      
      this.cardAmount = 0;

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

      let PlayInfo;
      let Role;
      let ExchangeInfo;
      let Selector;
      let MyPassBtn;
      let MyTableView;
      let MyCardFan;
      if(this.props.table.phase === "exchange"){
        if(this.props.table.president === this.props.table.id){
          Role = "President"
          PlayInfo = "Please select two cards for the Trash!"
        }else if(this.props.table.vicePresident === this.props.table.id){
          Role = "Vice President"
          PlayInfo = "Please select one card for the Vice Trash!"
        }else if(this.props.table.trash === this.props.table.id){
          Role = "Trash"
          PlayInfo = "Please wait until the President dumped two trash cards on you!"
        }else if(this.props.table.trash === this.props.table.id){
          Role = "Vice Trash"
          PlayInfo = "Please wait until the Vice President dumped a trash card on you!"
        }else {
          Role = "Neutral"
          PlayInfo = "Please wait until the President and Vice President dumped their trash cards!"
        }
        ExchangeInfo = <div id='ExchangeInfo'><h1>You Are {Role}</h1><p>{PlayInfo}</p></div>
        Selector = <ExchangeCardSelector setTableValue={this.props.setTableValue} sendCards={this.props.sendCards} playerName={this.props.name} setSelectedCards={this.setSelectedCards} playCards={this.playCards} getCardAmount={this.getCardAmount} selectedCards={this.state.selectedCards ? this.state.selectedCards : []} tableValue={this.props.table.tableValue} table={this.props.table}></ExchangeCardSelector>
        MyPassBtn = <div></div>
        MyTableView = <TableView key={this.props.table.tableValue} tableValue={this.props.table.tableValue} table={this.props.table}></TableView>
        MyCardFan = <CardFan cards={this.props.cards} key={String(this.props.cards)}></CardFan>
      }else {
        ExchangeInfo = <div></div>
        Selector = <CardSelector sendCards={this.props.sendCards} playerName={this.props.name} setSelectedCards={this.setSelectedCards} playCards={this.playCards} getCardAmount={this.getCardAmount} selectedCards={this.state.selectedCards} tableValue={this.props.table.tableValue} table={this.props.table}></CardSelector>
        MyPassBtn = <PassBtn playCards={this.props.playCards}></PassBtn>
        MyTableView = <TableView key={this.props.table.tableValue} tableValue={this.props.table.tableValue} table={this.props.table}></TableView>
        MyCardFan = <CardFan cards={this.props.cards} key={String(this.props.cards)}></CardFan>
      }

      let TurnInfo = this.props.table.players[this.props.table.turn] == this.props.table.id ? "Your turn!" : this.props.table.playerNames[this.props.table.turn] +"'s turn"

      return (
        <div id="GameScreen">
          <header>{TurnInfo}</header>
          {ExchangeInfo}
          {MyTableView}
          {MyCardFan}
          {Selector}
          {MyPassBtn}
        </div>
      )
    }
  }
  
export default GameScreen;  