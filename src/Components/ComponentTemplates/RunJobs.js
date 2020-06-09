import React from "react";
import RunPlaybackForm from "./RunPlaybackForm";
import TemplateStyles from "./TemplateStyles";
import Routes from "../Playback/Routes";
//If your file in anyway differs from this file, do not make any changes. Keep this file as is.
//Or the project will not compile. You will need to fix the changes you make, if you do so. Thanks.

class RunJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderRunForm: false,
      selectedJobId: 0,
      selectedJobName: "",
      statusCode: -1, //-1 fetching result 200/400 promise resolved, 0 = render job create form
      jobdata: [{ jobName: "testJob", jobID: "JOBID Test" }]
    };
  }

  getJobs = () => {
    fetch("/api/capture/jobs").then(resp => {
      if (resp.status === 200) {
        resp.parse().then(json => {
          this.setState({ statusCode: resp.status, jobdata: json });
        });
      } else {
        this.setState({ statusCode: resp.status, jobdata: [] });
      }
    });
  };

  callMeMaybe = () => {
    this.setState({
      renderRunForm: false,
      selectedJobId: 0
    });
  };

  componentDidMount = () => {
    this.getJobs();
  };
  renderForm = () => {
    let form = (
      <section className="card">
        <h3 className="card-header bg-success">Jobs Discovered</h3>
        <div className="card-body"></div>
      </section>
    );

    if (this.state.statusCode === -1) {
      form = (
        <section className="card">
          <h3 className="card-header bg-success">Fetching Jobs</h3>
          <div className="card-body">
            <div class="spinner-border text-success" role="status">
              <span class="sr-only">Loading Results...</span>
            </div>
          </div>
        </section>
      );
    } else if (this.state.statusCode === 200) {
      form = (
        <section className="card">
          <h3 className="card-header bg-success">Jobs Discovered</h3>
          <div className="card-body">{this.renderList()}</div>
        </section>
      );
    } else if (this.state.statusCode === 0) {
      form = <RunPlaybackForm playbackName={this.state.selectedJobName} />;
    } else if (this.state.statusCode >= 400) {
      form = (
        <section className="card">
          <h3 className="card-header bg-success">Jobs Discovered</h3>
          <div className="card-body container">
            <h3 className="row">Unable to run job</h3>
            <div className="row">
              <button
                className="btn-success"
                onClick={() => {
                  this.setState({ statusCode: 0 });
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      );
    }
    return form;
  };

  renderList = () => {
    let list = <div>No Completed Playback jobs discovered.</div>;

    if (
      this.state.jobdata !== null &&
      this.state.jobdata !== undefined &&
      this.state.jobdata.length > 0
    ) {
      list = this.state.jobdata.map(data => {
        return (
          <div key={data.jobId} className={TemplateStyles.listingStyle}>
            <div className={TemplateStyles.jobListing}>
              JobName: {data.jobName}
            </div>
            <input
              type="button"
              value="Deploy Job"
              className={TemplateStyles.RouteButton}
              onClick={e => {
                this.setState({
                  selectedJobId: data.jobID,
                  selectedJobName: data.jobName,
                  statusCode: 0
                });
              }}
            />
          </div>
        );
      });
    }

    return (
      <section className={TemplateStyles.listWrapper + " card"}>
        <h1 className=" card-header bg-success text-light">
          ---Jobs Discovered---
        </h1>
        <section className="card-body">{list}</section>
      </section>
    );
  };

  render = () => {
    return this.renderForm();
  };
}

export default RunJobs;
