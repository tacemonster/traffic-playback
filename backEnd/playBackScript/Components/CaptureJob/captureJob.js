import React from "react";
import Axios from "axios";
import "./captureJobStyles.css";

class CaptureJob extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      uri: "",
      secure: "NULL",
      protocol: "",
      host: "",
      method: "",
      sourceip: "",
      startdate: "",
      starttime: "",
      enddate: "",
      endtime: "",
      //will use startdate, starttime, enddate, endtime
      //to calculate start and end in milliseconds
      start: "",
      end: "",
      message: ""
    }
  }

  setField = (e) => {
    if(e.target.name == "uri"){
      this.setState({uri: e.target.value});
    }
    if(e.target.name == "secure"){
      this.setState({secure: e.target.value});
    }
    if(e.target.name == "protocol"){
      this.setState({protocol: e.target.value});
    }
    if(e.target.name == "host"){
      this.setState({host: e.target.value});
    }
    if(e.target.name == "method"){
      this.setState({method: e.target.value});
    }
    if(e.target.name == "sourceip"){
      this.setState({sourceip: e.target.value});
    }
    if(e.target.name == "startdate"){
      this.setState({startdate: e.target.value});
    }
    if(e.target.name == "starttime"){
      this.setState({starttime: e.target.value});
    }
    if(e.target.name == "enddate"){
      this.setState({enddate: e.target.value});
    }
    if(e.target.name == "endtime"){
      this.setState({endtime: e.target.value});
    }
  }

  calculateStartEnd () {
    let startCapture = this.state.startdate + this.state.starttime; 
    let endCapture = this.state.enddate + this.state.endtime; 
    this.setState({start: startCapture, end: endCapture});
  }


  async capture () {
    this.calculateStartEnd();

    const { data: message } = await Axios.post(
      "http://ec2-54-152-230-158.compute-1.amazonaws.com:8000/api/play",this.state 
    );
    this.setState({ message });
  }

  render(){
    return(
      <div>
        <form action={this.capture}>
          <label>URI: </label>
          <input type="text" name="uri" onChange={this.setField}></input>

          <label>Type: </label>
          <select name="secure" value={this.setField}>
            <option value="#[0]#">Insecure</option>
            <option value="#[1]#">Secure</option>
            <option value="NULL">Both</option>
	  </select>

          <label>Protocol: </label>
          <input type="text" name="protocol" onChange={this.setField}></input>

          <label>Host: </label>
          <input type="text" name="host" onChange={this.setField}></input>

          <label>Method: </label>
          <input type="text" name="method"onChange={this.setField}></input>

          <label>Source IP: </label>
          <input type="text" name="sourceip" onChange={this.setField}></input>

          <label>Start Date: </label>
          <input type="date" name="startdate" onChange={this.setField}></input>
          <label>Start Time: </label>
          <input type="time" name="starttime" onChange={this.setField}></input>

          <label>End Date: </label>
          <input type="date" name="enddate" onChange={this.setField}></input>
          <label>End Time: </label>
          <input type="time" name="endtime" onChange={this.setField}></input>
        </form>
      </div>
    )
  }
}

export default CaptureJob;



