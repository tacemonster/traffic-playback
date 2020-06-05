import React from "react";
import { useHistory } from "react-router-dom";
import HTTPServiceButton from "./HTTPServices/HTTPServiceButton";
import BackNavButton from "./BackNavButton";
//If your file in anyway differs from this file, do not make any changes. Keep this file as is.
//Or the project will not compile. You will need to fix the changes you make, if you do so. Thanks.
class CreateJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobName: "Black-Friday-Job",
      active: 0,
      jobStart: "2020-11-27",
      jobStop: "2020-11-28",
      secure: "secure",
      protocol: "HTTPS",
      hostname: "www.bigsales.com",
      uri: "/blackFridayBlowout",
      method: "GET",
      sourceip: "192.110.421.79"
    };
  }

  onChange(e) {
    e.preventDefault();
    let inputName = e.target.name;
    let stateValue = e.target.value;
    //if no invalid chars are detected
    let invalidCharTest = /[^1234567890]/g.test(stateValue);
    let stateNumberValue = Number(stateValue);
    if (inputName === "active" && !invalidCharTest) {
      switch (inputName) {
        case "active":
          this.setState({ active: stateNumberValue });
          break;
      }
    } else {
      switch (inputName) {
        case "jobName":
          this.setState({ jobName: stateValue });
          break;
        case "jobStart":
          this.setState({ jobStart: stateValue });
          break;
        case "jobStop":
          this.setState({ jobStop: stateValue });
          break;
        case "secure":
          this.setState({ secure: stateValue });
          break;
        case "protocol":
          this.setState({ protocol: stateValue });
          break;
        case "hostname":
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
          <section className="col-12 col-md-6">
            <h6>{key}</h6>
            <select
              name={key}
              type="text"
              value={this.state[key]}
              onChange={e => this.onChange(e)}
              placeholder="enter a value"
            >
              <option>secure</option>
              <option>insecure</option>
              <option>all</option>
            </select>
          </section>
        );
      } else if (key === "method") {
        return (
          <section className="col-12 col-md-6">
            <h6>{key}</h6>
            <select
              name={key}
              type="text"
              value={this.state[key]}
              onChange={e => this.onChange(e)}
              placeholder="enter a value"
            >
              <option>GET</option>
              <option>PUT</option>
              <option>POST</option>
              <option>DELETE</option>
            </select>
          </section>
        );
      } else if (key === "jobStart" || key === "jobStop") {
        return (
          <section className="col-12 col-md-6">
            <h6>{key}</h6>
            <input
              name={key}
              type="date"
              value={this.state[key]}
              onChange={e => this.onChange(e)}
              placeholder="enter a value"
            />
          </section>
        );
      } else
        return (
          <section className="col-12 col-md-6">
            <h6>{key}</h6>
            <input
              name={key}
              type="text"
              value={this.state[key]}
              onChange={e => this.onChange(e)}
              placeholder="enter a value"
            />
          </section>
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
      <div className="card">
        <h3 className="card-header bg-success text-light">
          //Schedule A Traffic Recording();
        </h3>
        <section className="card-body container">
          <section class="row">{this.buildForm()}</section>
          <br></br>
          <section className="row">
            {httpServiceButton}
            <BackNavButton />
          </section>
        </section>
      </div>
    );

    return retVal;
  };
}

export default CreateJob;
