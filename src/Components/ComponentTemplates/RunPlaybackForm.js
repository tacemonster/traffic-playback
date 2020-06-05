import React from "react";
import HTTPServiceButton from "./HTTPServices/HTTPServiceButton";
import TemplateStyles from "./TemplateStyles";
//If your file in anyway differs from this file, do not make any changes. Keep this file as is.
//Or the project will not compile. You will need to fix the changes you make, if you do so. Thanks.
class RunPlaybackForm extends React.Component {
  constructor(props) {
    super(props);
    let now = new Date();

    this.state = {
      jobId: props.jobId,
      verbose: 0,
      playbackSpeed: 1,
      port: 8080,
      securePort: 443,
      requestBufferTime: 10000,
      hostname: "localhost",
      backendServer: 1
    };
    this.onChange = this.onChange.bind(this);
    window.scrollTo(0, 0);
  }

  onChange(e) {
    e.preventDefault();
    let inputName = e.target.name;
    let stateValue = e.target.value;
    //if no invalid chars are detected
    let invalidCharTest = /[^1234567890]/g.test(stateValue);

    if (inputName === "hostname") {
      this.setState({ hostname: stateValue });
    } else if (!invalidCharTest) {
      switch (inputName) {
        case "verbose":
          this.setState({ verbose: stateValue });
          break;
        case "playbackSpeed":
          this.setState({ playbackSpeed: stateValue });
          break;
        case "port":
          this.setState({ port: stateValue });
          break;
        case "securePort":
          this.setState({ securePort: stateValue });
          break;
        case "requestBufferTime":
          this.setState({ requestBufferTime: stateValue });
          break;
        case "hostname":
          this.setState({ hostname: stateValue });
          break;
        case "backendServer":
          this.setState({ backendServer: stateValue });
          break;
      }
    }
  }

  buildForm = () => {
    // This function builds a dynamic form.
    let keys = Object.keys(this.state);

    let form = keys.map(key => {
      //Never give the user the ability to set jobId
      //return null in that case
      if (key === "jobId") return null;

      return (
        <section className="col-12 col-md-6">
          <h5>{key}</h5>
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
  render() {
    let retVal = null;
    let keyIndex = 0;
    let httpButtons = this.props.HTTPButtons.map(button => {
      keyIndex = keyIndex + 1;

      return (
        <HTTPServiceButton
          callMeMaybe={this.props.callMeMaybe}
          HTTPService={button.HTTPService}
          APIEndPoint={button.APIEndPoint}
          data={this.state}
          key={keyIndex}
          route={"/"}
        >
          Run Job
        </HTTPServiceButton>
      );
    });

    retVal = (
      <div className="card ">
        <h5 className="card-header bg-success text-light">
          {"Configuration Settings for jobName: " + this.props.jobName}
        </h5>
        <section className="card-body container">
          <section className="row">{this.buildForm()}</section>
          <section className="row align-items-center">
            {httpButtons}
            <input
              type="button"
              className={TemplateStyles.BackNavButton}
              onClick={this.props.callMeMaybe}
              value="Back"
            />
          </section>
        </section>
      </div>
    );

    return retVal;
  }
}

export default RunPlaybackForm;
