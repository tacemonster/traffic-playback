import "./PlaybackStyles.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Body from "../Body/BodyModule";
import Navbar from "../Nav/Navbar";
import HTTPClientEndPoint from "../ComponentTemplates/HTTPServices/HTTPClientEndPoint";
import HTTPClientFunctions from "../ComponentTemplates/HTTPServices/HTTPClientFunctions";
import RunJobs from "../ComponentTemplates/RunJobs";
import Routes from "./Routes";
import ConfigureJob from "../ConfigureJob/configureJob";
import { func } from "prop-types";
import TrafficStatistic from "../StatisticSite/TrafficStatistic";
import RealTimeMonitor from "../StatisticSite/RealTime";
import CreateJob from "../ComponentTemplates/CreateJob";

class PlayBack extends React.Component {
  constructor(props) {
    super(props);

    let HTTPService = new HTTPClientEndPoint();
    HTTPService.registerUrlStateHandler(Routes.init, HTTPClientFunctions.init);
    HTTPService.registerUrlStateHandler(
      Routes.run,
      HTTPClientFunctions.runplayback
    );
    HTTPService.registerUrlStateHandler(
      Routes.createjob,
      HTTPClientFunctions.createjob
    );

    this.state = {
      //Completed and InProgress URLS and job lists will be supplied by the database
      //For now they are hardcoded in.
      jobs: [],
      HTTPService: HTTPService
    };
  }

  componentDidMount() {
    this.state.HTTPService.init().then(resp => {
      this.setState({
        jobs: resp.jobs
      });
    });
  }
  //This app builds many dynamic routes.
  //buildDynamicRoutes is the function responsible for accomplishing this.
  // All dynamic routes are built here as opposed to grouping off each set of dynamic
  // routes into their own function for convinience. Each set of routes is  demarcated
  // by comments.

  //The render function renders the navbar which at this point is static
  //The render function also returns a Body component.
  // In the body component we then render routes such as
  // /completedjobs, /inprogressjobs, and etc.
  render() {
    //if (this.state.reRender) alert(JSON.stringify(this.state));
    return (
      <Router>
        <Navbar navLinks={this.props.navLinks} />
        <Body>
          <Switch>
            <Route exact path="/">
              <div>
                <h1>Notes</h1>
                <div>
                  {" "}
                  We are in the progress of designing live updates to the front
                  end. For example,if you create a new job and head over to the
                  run jobs tab without exiting, then the app wiil not display
                  the new job created. Just reload the app if this is the case.
                  We'll add this realtime update to the app soon.Also, some
                  forms do not validate input nor does the server validate their
                  unvalidated input, so SQL injection and phony values are all
                  possible. We're working on this. There's also misc
                  inconsitencies like scroll bar not resetting. We'll fix this.
                </div>
              </div>
            </Route>
            <Route exact path="/runcapture">
              <RunJobs
                jobs={this.state.jobs}
                HTTPService={this.state.HTTPService}
              />
            </Route>
            <Route exact path="/createjob">
              <CreateJob
                APIEndPoint={Routes.createjob}
                HTTPService={this.state.HTTPService}
              ></CreateJob>
            </Route>
            <Route exact path="/stats" component={TrafficStatistic}></Route>
            <Route exact path="/realtime" component={RealTimeMonitor}></Route>
          </Switch>
        </Body>
      </Router>
    );
  }
}

export default PlayBack;
