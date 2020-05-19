import React from "react";
import HTTPServiceButton from "./HTTPServices/HTTPServiceButton";
import TemplateStyles from "./TemplateStyles";

class RunPlaybackForm extends React.Component {
  constructor(props) {
    super(props);
    let now = new Date();
    let dateString = this.dateToString(now);

    this.state = {
      url: props.url,
      jobName: props.jobName,
      startTime: 0,
      endTime: 1,
      date: dateString
    };
    this.onChange = this.onChange.bind(this);
    window.scrollTo(0, 0);
  }

  dateToString(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  onChange(e) {
    e.preventDefault();
    let inputName = e.target.name;
    let stateValue = e.target.value;
    let regexTest = /[^012345679-]/g;
    let invalidChars = regexTest.test(stateValue);

    //if no invalid chars are detected
    if (!invalidChars) {
      let number = Number(stateValue); //convert the stateValue to a number now.
      switch (inputName) {
        case "startTime":
          if (number >= 0 && number < 2459)
            this.setState({ startTime: number });
          break;
        case "endTime":
          if (number >= 0 && number <= 2459) this.setState({ endTime: number });
          break;
        case "date":
          this.setState({ date: stateValue });
          break;
        default:
          break;
      }
    }
  }

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
          data={{
            jobName: this.state.jobName,
            startTime: this.state.startTime,
            endTime: this.state.endTime
            //date: this.state.date uncomment when server supports date checking
          }}
          key={keyIndex}
          route={"/runcapture"}
        >
          Run Job
        </HTTPServiceButton>
      );
    });

    retVal = (
      <div>
        <h3 className={TemplateStyles.listingHeader}>
          {" "}
          Config Job {this.props.jobName} for {this.props.url}
        </h3>
        <h2>Start Time</h2>
        <input
          name="startTime"
          type="text"
          value={this.state.startTime}
          onChange={e => this.onChange(e)}
          placeholder="enter 24hr format time (hhmm):0000,1232,2359, and etc"
        />
        <h2>End Time</h2>
        <input
          name="endTime"
          type="text"
          value={this.state.endTime}
          onChange={e => this.onChange(e)}
          placeholder="enter 24hr format time (hhmm):0000,1232,2359, and etc"
        />
        <h2>Date to run</h2>
        <input
          name="date"
          type="date"
          value={this.state.date}
          onChange={e => this.onChange(e)}
        />
        {httpButtons}
        <input
          type="button"
          className={TemplateStyles.BackNavButton}
          onClick={this.props.callMeMaybe}
          value="Back"
        />
      </div>
    );

    return retVal;
  }
}

export default RunPlaybackForm;
