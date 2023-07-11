import React from 'react';
import "./styles-components/opening-styles.css";

class InstructionsScreen extends React.Component {
    constructor(props){
      super(props);
      this.click = this.click.bind(this)
    }

    click(evt){
        console.log("Something")
        this.props.screenChange(0);
    }

    render(){
        return(
        <div id="InstructionsScreen">
          <header>
          </header>
          <h1>Instructions</h1>
          <div className="section">
            <h2>Hello!</h2>
            <p>
                This is my implementation of the card game "President". The Rules are simple:
                <ol>
                    <li>
                        The president starts the round by playing any amount of cards but they have to be of the same kind.
                    </li>
                    <li>
                        The next player can pass (play no card at all) or play cards. The amount of cards must be the same amount that the last player played. But the kind must be higher.
                    </li>
                    <li>
                        If a player playes Aces, the player can start a new round by choosing a new kind and amount.
                    </li>
                    <li>
                        The first player that gets rid of all cards becomes the president for the next round.
                    </li>
                    <li>
                        The second player that gets rid of all cards becomes the vice president for the next round.
                    </li>
                    <li>
                        The last player that gets rid of all cards becomes the trash for the next round.
                    </li>
                    <li>
                        The penultimate player that gets rid of all cards becomes the vice trash for the next round.
                    </li>
                    <li>
                        After the trash is determined new cards are dealt. The president chooses two cards to give to the trash. The trash returns the two highest cards. The vice president and the vice trash do the same, but with only one card.
                    </li>
                    <li>
                        This concludes a round. And the next round starts.
                    </li>
                </ol>
            </p>
            <h2>How to play</h2>
            <p>At first you can choose a name. Then you decide wheter you create a new table or you want to join an existing one. If you create a table you are asked for the number of players and a name for the table. Pass this name to your friends. Your friends can join the table by choosing "Join Table" and entering the name for the table. When the number of players is reached, a game starts.</p>
            <p>To play a card drag a card into the middle. If you can choose how many cards you want to play you can adjust this by dragging in the middle first and then to the left and right. In the top left corner is an indicator how many cards are played. Dragging to the right increases.</p>
            <p>To pass click the "PASS" button in the top right corner. In the middle is an indicator of whose turn it is.</p>
          </div>
          <nav>
            <button onClick={this.click}>Yes! Let me play!</button>
          </nav>
        </div>
        )
      }
}

export default InstructionsScreen;