import "./PlaybackStyles.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Body from "../Body/BodyModule";
import Navbar from "../Nav/Navbar";
import HTTPClientEndPoint from "../ComponentTemplates/HTTPServices/HTTPClientEndPoint";
import HTTPClientFunctions from "../ComponentTemplates/HTTPServices/HTTPClientFunctions";
import RunJobs from "../ComponentTemplates/RunJobs";
import Routes from "./Routes";
import TrafficStatistic from "../StatisticSite/TrafficStatistic";
import RealTimeMonitor from "../StatisticSite/RealTime";
import CreateJob from "../ComponentTemplates/CreateJob";
import PlaybackJobs from "./newPlayback.js";
import CaptureJobs from "../CaptureJob/newCaptureJob.js";
import ProjectLogo from "./ProjectLogo.png";

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
              <h3 className="card-header bg-success">Traffic Playback</h3>

              <div className="card">
                <h4 className="card-header">Asynchronous Server Blaster</h4>
                <div className="card-body container row">
                  <div className="col-12 col-md-6">
                    {" "}
                    <h4>Developed By Portland State's Capstone Team A</h4>
                    <ul>
                      <li>Medina Lamkin</li>
                      <li>Jordan Green</li>
                      <li>Zack Davis</li>
                      <li> Berin H.</li>
                      <li>James Vo</li>
                      <li>Tacy Bechtel</li>
                      <li>Huanxiang Su</li>
                      <li>Christopher Douglas </li>
                    </ul>
                  </div>

                  <img className="col-12 col-md-6" src={ProjectLogo} />
                </div>
              </div>

              <div className="card">
                <h3 className="card-header">The Mission of Playback</h3>
                <div className="card-body">
                  The Async. Server Blaster is a terrific tool for stress
                  testing code and hardware through replaying recorded traffic
                  captures. This application can support capturing traffic on
                  all user owned hostnames. Further, users can capture all
                  traffic to all URIs on a particular host or users can capture
                  a specific set of uris of a particular host. It's easy to play
                  this traffic back using our GUI or CLI. With a click of a few
                  buttons or the execution of a few commandline arguements,
                  playback occurrs. Our application is especially useful in
                  cases where the webserver is on the cloud and hardware
                  installations of traffic analysis tools is not possible. We
                  hope it can serve and add value you to your organization.
                  Enjoy!
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
            <Route exact path="/playback" component={PlaybackJobs} />
            <Route exact path="/capture" component={CaptureJobs} />
            <Route>
              <div className="card">
                <h1 className="card-header bg-warning"> 404</h1>
                <div className="card-body">
                  The requested url does not exist on the App. Use the navbar to
                  safely navigate through the app.
                </div>
              </div>
            </Route>
          </Switch>
        </Body>
      </Router>
    );
  }
}

export default PlayBack;
