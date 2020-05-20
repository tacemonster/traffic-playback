import React from "react";
import { useHistory } from "react-router-dom";
import HTTPServiceButton from "./HTTPServices/HTTPServiceButton";
import BackNavButton from "./BackNavButton";

class CreateJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobName: "name",
      active: 0,
      jobStart: 0,
      jobStop: 0,
      secure: "#1#",
      protocol: "",
      host: "hostname",
      uri: "uri",
      method: "method",
      sourceip: "1.1.1.1"
    };
  }

  onChange(e) {
    e.preventDefault();
    let inputName = e.target.name;
    let stateValue = e.target.value;
    //if no invalid chars are detected
    let invalidCharTest = /[^1234567890]/g.test(stateValue);
    let stateNumberValue = Number(stateValue);
    if (
      (inputName === "jobStart" ||
        inputName === "jobStop" ||
        inputName === "active") &&
      !invalidCharTest
    ) {
      switch (inputName) {
        case "jobStart":
          this.setState({ jobStart: stateNumberValue });
          break;
        case "jobStop":
          this.setState({ jobStop: stateNumberValue });
          break;
        case "active":
          this.setState({ active: stateNumberValue });
          break;
      }
    } else {
      switch (inputName) {
        case "secure":
          this.setState({ secure: stateValue });
          break;
        case "protocol":
          this.setState({ protocol: stateValue });
          break;
        case "host":
          this.setState({ hostname: stateValue });
          break;
        case "uri":
          this.setState({ uri: stateValue });
          break;
        case "method":
          this.setState({ method: stateValue });
          break;
        case "sourceip":
          this.setState({ sourceip: stateValue });
          break;
      }
    }
  }

  callMeMaybe = () => {
    const history = useHistory();
    history.push("/");
  };
  buildForm = () => {
    // This function builds a dynamic form.
    let keys = Object.keys(this.state);

    let form = keys.map(key => {
      //Never give the user the ability to set jobId
      //return null in that case

      if (key === "secure") {
        return (
          <React.Fragment>
            <h2>{key}</h2>
            <select
              name={key}
              type="text"
              value={this.state[key]}
              onChange={e => this.onChange(e)}
              placeholder="enter a value"
            >
              <option>#1#</option>
              <option>#2#</option>
              <option>#3#</option>
            </select>
          </React.Fragment>
        );
      } else
        return (
          <React.Fragment>
            <h2>{key}</h2>
            <input
              name={key}
              type="text"
              value={this.state[key]}
              onChange={e => this.onChange(e)}
              placeholder="enter a value"
            />
          </React.Fragment>
        );
    });
    return form;
  };

  render = () => {
    // This function builds a dynamic form.
    let keys = Object.keys(this.state);
    let httpServiceButton = (
      <HTTPServiceButton
        HTTPService={this.props.HTTPService}
        APIEndPoint={this.props.APIEndPoint}
        data={this.state}
        route="/"
        callMeMaybe={this.callMeMaybe}
      />
    );

    let retVal = (
      <div>
        <h6>Don's SQL inject me please. </h6>
        <p>
          On a serious note, this form does not have validation built into it.
          It will down the line, but the server DB will accept values for all
          fields seen below, even ones that are not valid.
        </p>
        {this.buildForm()}
        <br></br>
        {httpServiceButton}
        <BackNavButton />
      </div>
    );

    return retVal;
  };
}

export default CreateJob;
