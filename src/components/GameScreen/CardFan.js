import React from 'react';
import {clubs, spades, hearts, diamonds} from '../../svgs.js';


class CardFan extends React.Component {
    constructor(props){
      
      super(props)
  
      this.cards = props.cards
  
      this.myCards = this.cards.map((card, idx) => {
        return this.makeCard(card, ((idx-(this.cards.length/2))*5))
      })
  
      this.xStart = null;
      this.dx = null;
  
      this.radialSpeed = null;
      this.counter = 0
      this.interval = null;

      this.makeCard = this.makeCard.bind(this)
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.rotateCards = this.rotateCards.bind(this);
      this.handleMouseOut = this.handleMouseLeave.bind(this);
  
      this.handleTouchStart = this.handleTouchStart.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
      this.handleTouchEnd = this.handleTouchEnd.bind(this);
  
      this.rotatemore = this.rotatemore.bind(this);
    }
  
    handleMouseDown(evt){
      if(evt instanceof Event){
        evt.preventDefault()
      }
  
      if(this.interval){
        window.clearInterval(this.interval)
      }
  
      this.xStart = (100/window.innerHeight)*(evt.pageX-(window.innerWidth/2));
      this.xStart = Math.asin(((this.xStart)/135)) // 135: this is the transform-origin of the cards!
    }
  
    handleMouseMove(evt){
      if(this.xStart){
        if(evt instanceof Event){
          evt.preventDefault()
        }
        this.dx = Math.asin((100/window.innerHeight)*(evt.pageX-(window.innerWidth/2))/135) - this.xStart; // 135: this is the transform-origin of the cards!
        this.rotateCards(this.dx)
     
        if(!this.radialSpeed){
          this.radialSpeed = {x: Math.asin((100/window.innerHeight)*(evt.pageX-(window.innerWidth/2))/135), y: evt.pageY, timestamp: evt.timeStamp, radialSpeed:null}
        }else if(evt.timeStamp - this.radialSpeed.timestamp >= 100){
          this.radialSpeed = {x: Math.asin((100/window.innerHeight)*(evt.pageX-(window.innerWidth/2))/135), y: evt.pageY, timestamp: evt.timeStamp, radialSpeed: Math.asin((100/window.innerHeight)*(evt.pageX-(window.innerWidth/2))/135)-this.radialSpeed.x}
        }
      }
    }
  
    
  
    handleMouseUp(evt){
      if(evt instanceof Event){
        evt.preventDefault()
      }
      let cards = document.querySelectorAll("#cardFan .card");
      for(let card of cards){
        let rotation = Number(card.getAttribute("card_rotation"))
        card.setAttribute("card_rotation", rotation+this.dx*(180/Math.PI))
      }
      this.xStart = null;
      this.dx = null;
      if(this.radialSpeed){
        if(evt.timeStamp - this.radialSpeed.timestamp <= 50){
          this.interval = setInterval(this.rotatemore,1)
        }
      }
    }
  
    rotatemore(){
      // this is the rotateCards code
      let cards = document.querySelectorAll("#cardFan .card");
      console.log(this.radialSpeed.radialSpeed)
      for(let card of cards){
        let rotation = Number(card.getAttribute("card_rotation"))
        card.setAttribute("style", "transform: rotate("+String(rotation+(this.radialSpeed.radialSpeed/50)*(180/Math.PI))+"deg);")
        card.setAttribute("card_rotation", String(rotation+(this.radialSpeed.radialSpeed/50)*(180/Math.PI)))
        if(this.radialSpeed.radialSpeed>0.0005){
          this.radialSpeed.radialSpeed -= 0.0002 * this.counter/100;
        }else if(this.radialSpeed.radialSpeed<-0.0005){
          this.radialSpeed.radialSpeed += 0.0002 * this.counter/100
        }else{
          this.radialSpeed.radialSpeed = 0;
        }
        
      }
  
      this.counter += 5;
      if(this.counter >= 1000){
        window.clearInterval(this.interval)
        this.counter = 0
      }
    }
  
    handleMouseLeave(evt){
      if(evt.pageX){
        evt.preventDefault()
      }
      this.xStart = null;
      if(this.interval){
        window.clearInterval(this.interval)
      }
    }
  
    handleTouchStart(evt){
      evt.preventDefault();
      evt.stopPropagation()
      this.handleMouseDown(evt.changedTouches[0]);
    }
  
    handleTouchMove(evt){
      evt.preventDefault();
      let newEvent = evt.changedTouches[0]
      newEvent.timeStamp = evt.timeStamp;
      this.handleMouseMove(newEvent);
    }
  
    handleTouchEnd(evt){
      evt.preventDefault();
      let newEvent = evt.changedTouches[0]
      newEvent.timeStamp = evt.timeStamp;
      this.handleMouseUp(newEvent);
    }
  
    rotateCards(deg){
      let cards = document.querySelectorAll("#cardFan .card");
      for(let card of cards){
        let rotation = Number(card.getAttribute("card_rotation"));
        card.setAttribute("style", "transform: rotate("+String(rotation+deg*(180/Math.PI))+"deg);");
      }
    }
  
    makeCard(args, rotation){
      const color = args[1];
      const value = args[0];
  
      const rotate_string = "transform: rotate(" + String(rotation) + "deg);"
  
      switch(color){
        case("H"):
          return <div key={String(value)+color} className="card" style={{transform: "rotate(" + rotation + "deg)"}} card_rotation={String(rotation)} value={value}><span className="cardvalue red"></span>{value}<span className="cardcolor">{hearts}</span></div>
        case("D"):
          return <div key={String(value)+color} className="card" style={{transform: "rotate(" + rotation + "deg)"}} card_rotation={String(rotation)} value={value}><span className="cardvalue red"></span>{value}<span className="cardcolor">{diamonds}</span></div>
        case("S"):
          return <div key={String(value)+color} className="card" style={{transform: "rotate(" + rotation + "deg)"}} card_rotation={String(rotation)} value={value}><span className="cardvalue red"></span>{value}<span className="cardcolor">{spades}</span></div>
        case("C"):
          return <div key={String(value)+color} className="card" style={{transform: "rotate(" + rotation + "deg)"}} card_rotation={String(rotation)} value={value}><span className="cardvalue red"></span>{value}<span className="cardcolor">{clubs}</span></div>
        default:
          <div key={String(value)+color} className="card" style={{transform: "rotate(" + rotation + "deg)"}} card_rotation={String(rotation)} value={value}><span className="cardvalue red"></span><span className="cardcolor"></span></div>
      }
    }
  
  
    componentDidMount(){
      const fan = document.getElementById("cardFan");
      fan.addEventListener("mousedown", this.handleMouseDown);
      fan.addEventListener("mousemove", this.handleMouseMove);
      fan.addEventListener("mouseup", this.handleMouseUp);
      fan.addEventListener("mouseleave", this.handleMouseLeave);
  
      fan.addEventListener("touchstart", this.handleTouchStart, {passive: false});
      fan.addEventListener("touchend", this.handleTouchEnd, {passive: false});
      fan.addEventListener("touchmove", this.handleTouchMove, {passive: false});
    }

    
  
    render(){
      return (
        <div id="cardFan">{this.myCards}</div>
      )
    }
  }
  

  export default CardFan;