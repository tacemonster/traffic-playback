import React from "react";
import "./configureJobStyles.css";

class ConfigureJob extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            pbspeed : '1'
        };
    }

    changePBSpeed = (e) => {
        this.setState({pbspeed : e.target.value});
    }

    render(){
        return(
            <div>
                <h1>Configure Job</h1>

                <form action='./index.js'>
                    <label for='pbspeed'>Playback Speed = </label>
                    <input type='number' min='0' step='0.1' value={this.state.pbspeed} 
                    id='pbspeed' name='pbspeed' onChange={this.changePBSpeed}></input>
                </form>
            </div>
        )
    }
}

export default ConfigureJob;
