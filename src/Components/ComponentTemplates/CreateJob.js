import React from "react";
import { useHistory } from "react-router-dom";
import BackNavButton from "./BackNavButton";

function ErrorMsg(props) {
  return (
    <section className="card col-12 mx-0 px-0">
      <div className={"card-header " + props.className || "bg-danger"}>
        {props.header || "Error"}
      </div>
      <div className="card-body">{props.msg}</div>
    </section>
  );
}
//Used to fill default placeholder values in forms.
//Do we want regexs here or no?
let placeholderValues = {
  jobName: "Playback-Job",
  jobStart: "MM-DD-YYYY",
  jobStop: "MM-DD-YYYY",
  secure: "Secure",
  protocolName: "HTTP,HTTPS,",
  hostName: "Hostname",
  uriName: "/Uri",
  method: "GET,PUT,POST,DELETE",
  sourceip: "123.456.789.123"
};

//Used to make usernames more friendly.
let nameMapper = {
  jobName: "Job Name *required",
  jobStart: "Start Date",
  jobStop: "End Date",
  secure: "Secure",
  protocolName: "Protocol",
  hostName: "Hostname ",
  uriName: "Uniform Resource Identifier",
  methodName: "Method Name",
  sourceip: "Source Ip"
};

let regExpMapper = { secure: "[0]", insecure: "[1]", all: "[01]" };

//If your file in anyway differs from this file, do not make any changes. Keep this file as is.
//Or the project will not compile. You will need to fix the changes you make, if you do so. Thanks.

class CreateJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobName: "",
      // active: 0,
      jobStart: "",
      jobStop: "",
      secure: "",
      protocolName: "",
      hostName: "",
      uriName: "",
      methodName: "",
      sourceip: "",
      statusCode: -1
      //-1 indicates no requests have been issued to the backend
      // 0 indicates a request has been issued and a response is being awaited.
      //200 indicates job creation is succesful
      //400 indicates job creation is not succesful because of jobName conflicts.
    };
  }

  onChange(e) {
    e.preventDefault();
    let inputName = e.target.name;
    let stateValue = e.target.value;
    //if no invalid chars are detected
    let invalidCharTest = /[^1234567890]/g.test(stateValue);
    let stateNumberValue = Number(stateValue);
    /*if (inputName === "active" && !invalidCharTest) {
      switch (inputName) {
        case "active":
          this.setState({ active: stateNumberValue });
          break;
      }
    }*/

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
      case "protocolName":
        this.setState({ protocolName: stateValue });
        break;
      case "hostName":
        this.setState({ hostName: stateValue });
        break;
      case "uriName":
        this.setState({ uri: stateValue });
        break;
      case "methodName":
        this.setState({ method: stateValue });
        break;
      case "sourceip":
        this.setState({ sourceip: stateValue });
        break;
      case "statusCode":
        this.setState({ renderSetting: Number(stateValue) });
        break;
    }
  }

  buildForm = () => {
    let form = null;
    // This function builds a dynamic form.
    if (this.state.statusCode !== 200) {
      let keys = Object.keys(this.state);

      form = keys.map(key => {
        //Never give the user the ability to set jobId
        //return null in that case

        if (key === "secure") {
          return (
            <section className="col-12 col-md-6">
              <h6>{nameMapper[key]}</h6>
              <select
                name={key}
                type="text"
                value={this.state[key]}
                onChange={e => this.onChange(e)}
                placeholder={placeholderValues[key]}
              >
                <option>all</option>
                <option>secure</option>
                <option>insecure</option>
              </select>
            </section>
          );
        } else if (key === "methodName") {
          return (
            <section className="col-12 col-md-6">
              <h6>{nameMapper[key]}</h6>
              <select
                name={key}
                type="text"
                value={this.state[key]}
                onChange={e => this.onChange(e)}
                placeholder={placeholderValues[key]}
              >
                <option>GET</option>
                <option>PUT</option>
                <option>POST</option>
                <option>DELETE</option>
                <option>ALL</option>
              </select>
            </section>
          );
        } else if (key === "jobStart" || key === "jobStop") {
          return (
            <section className="col-12 col-md-6">
              <h6>{nameMapper[key]}</h6>
              <input
                name={key}
                type="date"
                value={this.state[key]}
                onChange={e => this.onChange(e)}
                placeholder={placeholderValues[key]}
              />
            </section>
          );
        } else if (key !== "renderSetting" && key !== "statusCode")
          return (
            <section className="col-12 col-md-6">
              <h6>{nameMapper[key]}</h6>
              <input
                name={key}
                type="text"
                value={this.state[key]}
                onChange={e => this.onChange(e)}
                placeholder={placeholderValues[key]}
              />
            </section>
          );
      });
    }
    return form;
  };

  buildSuccessMessage = () => {
    return (
      <section>
        <h6> Job Deployment Success</h6>
        <div>JobName: {this.state.jobName} succesfully created.</div>
        LEFT OFF HERE
      </section>
    );
  };

  onClick = () => {
    this.setState({ renderSetting: "promise-dispatched" });
    if (this.state.jobName !== "") {
      if (this.state.hostName !== "") {
        this.setState({ statusCode: 200 });
        fetch("/api/createjob").then(resp => {
          if (resp === 200) {
            this.setState({ renderSetting: "promise-resolved-200" });
          } else {
            this.setState({ renderSetting: "promise-resolved-400" });
          }
        });
      }
    }
  };

  buildButton = () => {
    let retButton = (
      <button
        class="btn btn-primary"
        type="button"
        name="pending"
        onClick={e => this.onClick(e)}
      >
        Create Job
      </button>
    );

    if (this.state.renderSetting === "promise-pending") {
      retButton = (
        <button class="btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Creating Job...
        </button>
      );
    }

    return retButton;
  };

  render = () => {
    // This function builds a dynamic form.

    let retVal = (
      <div className="card">
        <h3 className="card-header bg-success text-light">
          //Schedule A Traffic Recording();
        </h3>
        <section className="card-body container">
          {this.state.statusCode === 400 ? ( //if 400 is returned as the error code, render the error notification.
            <ErrorMsg msg="The entered jobName must be unique." />
          ) : null}

          {this.state.hostName === "" ? ( //if 400 is returned as the error code, render the error notification.
            <ErrorMsg
              msg="The hostName is empty."
              header="Warning"
              className="bg-warning"
            />
          ) : null}
          <section class="row">{this.buildForm()}</section>
          <br></br>
          <section className="row">{this.buildButton()}</section>
        </section>
      </div>
    );

    return retVal;
  };
}

export default CreateJob;
