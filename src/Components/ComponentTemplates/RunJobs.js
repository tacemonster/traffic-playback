import React from "react";
import RunPlaybackForm from "./RunPlaybackForm";
import TemplateStyles from "./TemplateStyles";

class RunJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderRunForm: false,
      selectedJobData: { url: "url-N/A", jobName: "job-name-N/A" }
    };
  }

  callMeMaybe = () => {
    this.setState({
      renderRunForm: false,
      selectedJobData: { url: "url-N/A", jobName: "job-name-N/A" }
    });
  };
  renderForm = () => {
    return (
      <RunPlaybackForm
        callMeMaybe={this.callMeMaybe}
        url={this.state.selectedJobData.url}
        jobName={this.state.selectedJobData.jobName}
        HTTPButtons={[
          {
            APIEndPoint: "http://localhost:8000/api/play/run",
            data: this.state.selectedJobData,
            HTTPService: this.props.HTTPService
          }
        ]}
      />
    );
  };

  runClick = e => {
    this.setState({ renderRunForm: true, selectedJobData: e.target.data });
  };
  renderList = () => {
    let jobUrls = this.props.CompletedCaptureJobsUrls;
    let retVal = <section>No Completed Playback jobs discovered.</section>;

    if (jobUrls !== null && jobUrls !== undefined) {
      let urlKeys = Object.keys(jobUrls);

      if (urlKeys !== null && urlKeys !== undefined && urlKeys.length > 0) {
        let list = urlKeys.map(url => {
          return (
            <div key={url} className={"container"}>
              <div className={TemplateStyles.rowHeading}>
                <h2 className={TemplateStyles.Heading}>{"{" + url + "}"}</h2>
              </div>

              {jobUrls[url].map(jobName => {
                return (
                  <div key={jobName} className={TemplateStyles.listingStyle}>
                    <div className={TemplateStyles.jobListing}>{jobName}</div>
                    <input
                      data={{ url: url, jobName: jobName }}
                      type="button"
                      value="run"
                      className={TemplateStyles.RouteButton}
                      onClick={e => {
                        this.setState({
                          renderRunForm: true,
                          selectedJobData: { url: url, jobName: jobName }
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        });
        retVal = (
          <section className={TemplateStyles.listWrapper}>
            <h1 className={TemplateStyles.listingHeader}>
              ---Jobs Discovered---
            </h1>
            {list}
          </section>
        );
      }
    }
    return retVal;
  };

  render = () => {
    return this.state.renderRunForm ? this.renderForm() : this.renderList();
  };
}

export default RunJobs;
