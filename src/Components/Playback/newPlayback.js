import React, { Component } from "react";
import Axios from "axios";
import DatePicker from "./datePicker";
import Button from "./button";

class Playback extends Component {
  state = {
    jobs: [],
    message: [],
    text: "Play",
  };

  capture = {
    jobName: "",
    startTime: 0,
    endTime: 0,
  };

  changeText = (text) => {
    this.setState({ text });
  };

  async componentDidMount() {
    const { data: jobs } = await Axios.get(
      "http://ec2-54-152-230-158.compute-1.amazonaws.com:8000/api/capture/jobs"
    );

    this.setState({ jobs });
  }

  handleDelete = (job) => {
    const jobs = this.state.jobs.filter((m) => m._id !== job._id);
    this.setState({ jobs });
  };

  render() {
    const { length: count } = this.state.jobs;
    const { text } = this.state;

    if (count === 0) return <p>There are no job in the database.</p>;

    return (
      <React.Fragment>
        <h2>Playback Jobs</h2>
        <p>Showing {count} available playback jobs in the database.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Job Name</th>
              <th>Start Date & Time</th>
              <th>End Date & Time</th>
              <th>Playback</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs.map((job) => (
              <tr key={job.jobID}>
                <td>{job.jobName}</td>

                <Button
                  id={job.jobName}
                  label="Play"
                  text={this.state.text}
                  jobName={job.jobName}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default Playback;

