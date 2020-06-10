import React from "react";

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
  jobname: "Playback-Job",
  jobStart: "MM-DD-YYYY",
  jobStop: "MM-DD-YYYY",
  secure: "Secure",
  protocol: "#HTTP\/.*\..*#",
  host: "#.*\.host\.com#",
  uri: "#/uri/.*#",
  method: "#((GET)|(POST))#",
  sourceip: "#.*\..*\..*\..*#"
};

//Used to make usernames more friendly.
let nameMapper = {
  jobname: "Job Name *required",
  jobStart: "Start Date",
  jobStop: "End Date",
  secure: "Security Setting",
  protocol: "Networking Protocol",
  host: "Hostname",
  uri: "Uri",
  method: "Method Type",
  sourceip: "Source Ip"
};

let regExpMapper = { secure: "#[0]#", insecure: "#[1]#", all: "#[01]#" };

//If your file in anyway differs from this file, do not make any changes. Keep this file as is.
//Or the project will not compile. You will need to fix the changes you make, if you do so. Thanks.

class CreateJob extends React.Component {
  constructor(props) {
    super(props);

    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.state = {
      jobname: "",
      active: 0,
      secure: "all",
      jobStart: this.formatDateString(today),
      jobStop: this.formatDateString(tomorrow),
      protocol: "",
      host: "",
      uri: "",
      sourceip: "",
      method: "",
      statusCode: -1
      //-1 indicates no requests have been issued to the backend
      // 0 indicates a request has been issued and a response is being awaited.
      //200 indicates job creation is succesful
      //400 indicates job creation is not succesful because of jobname conflicts.
    };
  }

  formatDateString = date => {
    const offset = date.getTimezoneOffset();
    let dateString = new Date(date.getTime() + offset * 60 * 1000);
    return dateString.toISOString().split("T")[0];
  };

  parseDate = s => {
    var b = s.split(/\D/);
    return new Date(b[0], --b[1], b[2]);
  };

  onChangeDateCheck = (inputName, stateValue) => {
    let parsedStateValue = Date.parse(stateValue);
    let parsedTodayValue = Date.parse(new Date());

    switch (inputName) {
      case "jobStart":
        if (
          parsedStateValue < Date.parse(this.state.jobStop) &&
          parsedStateValue >= parsedTodayValue
        )
          this.setState({ jobStart: stateValue });
        break;
      case "jobStop":
        if (
          parsedStateValue > Date.parse(this.state.jobStart) &&
          parsedStateValue > parsedTodayValue
        )
          this.setState({ jobStop: stateValue });
        break;
    }
  };
  onChange(e) {
    let inputName = e.target.name;
    let stateValue = e.target.value;
    let checkboxValue = e.target.checked;

    switch (inputName) {
      case "jobname":
        this.setState({ jobname: stateValue });
        break;
      case "jobStart":
        this.onChangeDateCheck(inputName, stateValue);
        break;
      case "jobStop":
        this.onChangeDateCheck(inputName, stateValue);
        break;
      case "secure":
        this.setState({ secure: stateValue });
        break;
      case "protocol":
        this.setState({ protocol: stateValue });
        break;
      case "host":
        this.setState({ host: stateValue });
        break;
      case "uri":
        this.setState({ uri: stateValue });
        break;
      case "sourceip":
        this.setState({ sourceip: stateValue });
        break;
      case "statusCode":
        this.setState({ statusCode: Number(stateValue) });
        break;
      case "method":
        this.setState({ method: stateValue });
        break;
    }
  }

  buildForm = () => {
    let form = null;
    // This function builds a dynamic form.
    if (this.state.statusCode === -1) {
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
        } else if (key !== "statusCode" && key !== "active")
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
    } else if (this.state.statusCode === 0) {
      form = (
        <section className="spinner-grow text-success" role="status">
          {" "}
          <span class="sr-only">Job is scheduling...</span>
        </section>
      );
    } else if (this.state.statusCode === 200) {
      let stateKeys = Object.keys(this.state);

      form = (
        <section>
          <h2>Job Creation Succesful</h2>
          <section className="container"></section>
          {
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Job Property Name</th>
                  <th scope="col"> Job Property Value</th>
                </tr>
                {stateKeys.map(key => {
                  if (key !== "statusCode") {
                    return (
                      <tr>
                        <td>{key}</td>
                        <td>{this.state[key] || "empty field submitted"}</td>
                      </tr>
                    );
                  } else return null;
                })}
              </thead>
            </table>
          }
          <section className="container"></section>
        </section>
      );
    } else if (this.state.statusCode === 404) {
      form = (
        <section className="container card">
          <h3 className="card-header">Internal Server Error</h3>
          <div className="card-body">
            Internal Server Error encountered. Please try again later.
          </div>
        </section>
      );
    }
    return form;
  };

  onClick = () => {
    if (this.state.jobname !== "") {
      this.setState({ statusCode: 0 });

      fetch("http://ec2-54-152-230-158.compute-1.amazonaws.com:7999/api/createJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: this.onClickStateFormat()
      }).then(resp => {
        if (resp.status === 200) {
          this.setState({ statusCode: 200 });
        } else if (resp.statusCode === 400) {
          this.setState({ statusCode: 400 });
        } else {
          this.setState({ statusCode: 404 });
        }
      });
    }
  };

  onClickStateFormat = () => {
    let json = {
      jobname: this.state.jobname,
      active: 0,
      jobStart: Date.parse(this.state.jobStart)/1000,
      jobStop: Date.parse(this.state.jobStop)/1000,
      secure: regExpMapper[this.state.secure],
      protocol: this.state.protocol,
      host: this.state.host,
      uri: this.state.uri,
      method: this.state.method,
      sourceip: this.state.sourceip
    };
    return JSON.stringify(json);
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

    if (this.state.statusCode === 0) {
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
    } else if (this.state.statusCode === 200) {
      retButton = (
        <button
          class="btn btn-primary"
          type="button"
          onClick={() => {
            this.setState({
              jobname: "",
              // active: 0,
              jobStart: "",
              jobStop: "",
              secure: "",
              protocol: "",
              host: "",
              uri: "",
              method: "",
              sourceip: "",
              statusCode: -1
            });
          }}
        >
          Create Another Job
        </button>
      );
    } else if (this.state.statusCode === 400 || this.state.statusCode === 404) {
      retButton = (
        <button
          class="btn btn-primary"
          type="button"
          onClick={() => {
            this.setState({
              statusCode: -1
            });
          }}
        >
          Retry
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
            <ErrorMsg msg="The entered jobname must be unique." />
          ) : null}

          {this.state.jobname === "" && this.state.statusCode === -1 ? ( //if 400 is returned as the error code, render the error notification.
            <ErrorMsg
              msg="The jobname is empty. This is a required field.Unable to dispatch request."
              header="Error"
              className="bg-danger"
            />
          ) : null}
          <section class="card col-12 mx-0 px-0">
            <div className="card-header bg-success">
              Use Regex 101 to help build regex input values.
              Regex needs to be formatted into PCRE(PHP) format.

            </div>
            <a
              className="card-body"
              target="_blank"
              href="https://regex101.com/"
            >
              Link to regex101
            </a>
          </section>
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
