import React from 'react';

class TurnIndicator extends React.Component {
    constructor(props){
        super(props)

        this.turnIdx = props.turn;
        this.playerNames = props.playerNames;
    }

    render(){
        return (
            <div id="TurnIndicator" key={String(this.props.turn)+String(this.props.playerNames)}>
                {this.playerNames.map((name) => {
                    return (<div class="namePlate">{name}</div>)
                })}
            </div>
        )
    }
}

export default TurnIndicator;  