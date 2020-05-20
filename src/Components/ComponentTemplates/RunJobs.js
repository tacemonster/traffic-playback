import React from "react";
import RunPlaybackForm from "./RunPlaybackForm";
import TemplateStyles from "./TemplateStyles";
import Routes from "../Playback/Routes";

class RunJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderRunForm: false,
      selectedJobId: 0,
      jobs: props.jobs
    };
  }

  callMeMaybe = () => {
    this.setState({
      renderRunForm: false,
      selectedJobId: 0
    });
  };
  renderForm = () => {
    return (
      <RunPlaybackForm
        callMeMaybe={this.callMeMaybe}
        jobId={this.state.selectedJobId}
        HTTPButtons={[
          {
            APIEndPoint: Routes.run,
            data: this.state.selectedJobId,
            HTTPService: this.props.HTTPService,
            route: "/"
          }
        ]}
      />
    );
  };

  runClick = e => {
    this.setState({ renderRunForm: true, selectedJobData: e.target.data });
  };
  renderList = () => {
    let list = <div>No Completed Playback jobs discovered.</div>;

    if (
      this.props.jobs !== null &&
      this.props.jobs !== undefined &&
      this.props.jobs.length > 0
    ) {
      list = this.props.jobs.map(jobId => {
        return (
          <div key={jobId} className={TemplateStyles.listingStyle}>
            <div className={TemplateStyles.jobListing}>JobID: {jobId}</div>
            <input
              type="button"
              value="Deploy Job"
              className={TemplateStyles.RouteButton}
              onClick={e => {
                this.setState({
                  renderRunForm: true,
                  selectedJobId: jobId
                });
              }}
            />
          </div>
        );
      });
    }

    return (
      <section className={TemplateStyles.listWrapper}>
        <h1 className={TemplateStyles.listingHeader}>---Jobs Discovered---</h1>
        {list}
      </section>
    );
  };

  render = () => {
    return this.state.renderRunForm ? this.renderForm() : this.renderList();
  };
}

export default RunJobs;
