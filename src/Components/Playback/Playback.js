import "./PlaybackStyles.css";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import Body from "../Body/BodyModule";
import BackNavHeadingTemplate from "../ComponentTemplates/BackNavHeadingTemplate";
import NavListing from "../ComponentTemplates/Listings";
import Navbar from "../Nav/Navbar";
import HTTPClientEndPoint from "../ComponentTemplates/HTTPServices/HTTPClientEndPoint";

//This class reports URLS and URL->[job list mappings] for the playback app.
class UrlJobInfo {
  constructor(urlData) {
    this.urlInfo = urlData;
    this.equals = this.equals.bind(this);
  }

  getUrls = () => {
    let ret_val = ["No URL Record Sessions On File"];

    if (Object.keys(this.urlInfo).length > 0)
      ret_val = Object.keys(this.urlInfo);

    return ret_val;
  };

  //Returns a list of one or more url assigned jobs or null for a url with no jobs.
  getUrlJobs = url => {
    let ret_val = <div>PLACEHOLDER no jobs completed for this url</div>;
    //if state[type] or state[type][url] is not undefined, then set the return value to whatever value is stored.
    if (this.urlInfo[url] !== undefined && this.urlInfo[url].length > 0) {
      ret_val = this.urlInfo[url];
    }
    return ret_val;
  };

  //This method checks for equality of one UrlInfoService object to another.
  //This method will be used to supply one of possibly many boolean values
  //to determine whether or not to update the state of the main PlayBack app.
  equals(other) {
    let ret_val = false;

    if (
      other instanceof UrlJobInfo &&
      Array.equals(this.urlInfo, other.urlInfo)
    )
      ret_val = true;

    return ret_val;
  }
}
//The playback class is mainly used to configure routing settings, and perform communication
//with the database, either directly or through a service  component. We'll see what the best
//setup is once we cross that bridge.

class PlayBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Completed and InProgress URLS and job lists will be supplied by the database
      //For now they are hardcoded in.
      CompletedJobsUrls: new UrlJobInfo({
        "www.google.com": ["1-x-x-placeholder", "2-x-x-placeholder"],
        "www.google2.com": ["1-x-x-placeholder", "2-x-x-placeholder"],
        "www.google3.com": ["1-x-x-placeholder"]
      }),
      InProgressJobsUrls: new UrlJobInfo({
        "www.facebook.com": ["1-2-x-placeholder", "2-x-x-placeholder"],
        "www.dogpile.com": ["1-x-x-placeholder", "2-x-x-placeholder"]
      })
    };
  }

  //This app builds many dynamic routes.
  //buildDynamicRoutes is the function responsible for accomplishing this.
  // All dynamic routes are built here as opposed to grouping off each set of dynamic
  // routes into their own function for convinience. Each set of routes is  demarcated
  // by comments.
  buildDynamicRoutes = () => {
    let inProgressUrls = this.state.InProgressJobsUrls.getUrls();
    let completedUrls = this.state.CompletedJobsUrls.getUrls(); //Contains all urls for which capture is complete.
    let routeList = []; //This list contains all Routes, dynamic or static, the app employs.

    let concatRoutes = []; //This array will concat all dynamic or status routes to the route list.
    let url_iterator = ""; //This is an iterator used in for loops declared below

    //Build completedjobs routes START--------------------
    concatRoutes = (
      <Route exact path="/completedjobs">
        <BackNavHeadingTemplate>Completed Jobs</BackNavHeadingTemplate>
        {completedUrls.map(url => {
          let route = "/completed" + url + "jobs";
          return (
            <NavListing
              listingTitle={"Completed Captured Jobs"}
              value={url}
              buttons={[{ name: "Select", route: route }]}
            />
          );
        })}
      </Route>
    );

    routeList = routeList.concat(concatRoutes);
    //Build /completedroutes FINISH-------------------------
    //*************************************************** */
    //Build /inprogressjobs routes START--------------------
    concatRoutes = (
      <Route exact path="/inprogressjobs">
        <BackNavHeadingTemplate>In Progress Captures</BackNavHeadingTemplate>
        {inProgressUrls.map(url => {
          let route = "/inprogress" + url + "jobs";
          return (
            <NavListing
              listingTitle={"Completed Captured Jobs"}
              value={url}
              buttons={[{ name: "Select", route: route }]}
            />
          );
        })}
      </Route>
    );

    routeList = routeList.concat(concatRoutes);
    //Build /completedroutes FINISH-------------------------

    //build /completed{DYNAMICURL}jobs START---------------
    for (let i in completedUrls) {
      url_iterator = completedUrls[i];
      let urlJobsList = this.state.CompletedJobsUrls.getUrlJobs(url_iterator); //get all completed jobs assigned to a url
      let route = "/completed" + url_iterator + "jobs";

      concatRoutes = (
        <Route exact path={route}>
          <BackNavHeadingTemplate>
            {"Completed Jobs For URL " + url_iterator}
          </BackNavHeadingTemplate>
          {urlJobsList.map(urlJob => {
            return (
              <NavListing
                value={urlJob}
                buttons={[
                  { name: "Run", route: route },
                  { name: "Configure", route: route }
                ]}
              />
            );
          })}
        </Route>
      );
      routeList = routeList.concat(concatRoutes);
    }
    ////build /completed{DYNAMICURL}jobs FINISH-------------
    for (let i in inProgressUrls) {
      url_iterator = inProgressUrls[i];
      let urlJobsList = this.state.InProgressJobsUrls.getUrlJobs(url_iterator); //get all completed jobs assigned to a url
      let route = "/inprogress" + url_iterator + "jobs";

      concatRoutes = (
        <Route exact path={route}>
          <BackNavHeadingTemplate>
            {"InProgress Jobs For URL " + url_iterator}
          </BackNavHeadingTemplate>
          {urlJobsList.map(urlJob => {
            return (
              <NavListing
                value={urlJob}
                buttons={[
                  { name: "Cancel", route: route },
                  { name: "Pause", route: route }
                ]}
              />
            );
          })}
        </Route>
      );
      routeList = routeList.concat(concatRoutes);
    }
    //Return the list of all routes and their assigned components for rendering.
    return <React.Fragment>{routeList}</React.Fragment>;
  };

  //This method determines whether or not we should call render based on comparing the current PlayBack state
  // against the next state react will assign to this object.
  //If the states are identical, then there is no need to call render since its
  // rather expensive and should be avoided when possible.
  shouldComponentUpdate(nextProps, nextState) {
    // The two let expressions produce boolean values that compare various
    // fields in play backstate for inequality.
    let completedJobsNotEqual = !this.state.CompletedJobsUrls.equals(
      nextState.CompletedJobsUrls
    );
    let inProgressJobsNotEqual = !this.state.InProgressJobsUrls.equals(
      nextState.InProgressJobsUrls
    );

    // Finally, if even of these objects is not equal to each other,
    //then react should rerender playback. This could be beacuse an InProgress Job is now
    // marked completed or a new InProgress job was initiated, and etc. All of these actions
    //require dynamic route updates.
    return completedJobsNotEqual || inProgressJobsNotEqual;
  }

  //The render function renders the navbar which at this point is static
  //The render function also returns a Body component.
  // In the body component we then render routes such as
  // /completedjobs, /inprogressjobs, and etc.
  render() {
    return (
      <Router>
        <Navbar
          navLinks={this.props.navLinks}
          urls={this.getUrls}
          urlJobs={this.getUrlJobs}
        />
        <Body>
          <Switch>
            <Route exact path="/">
              <div>Home Placeholder</div>
            </Route>
            {this.buildDynamicRoutes()}
          </Switch>
        </Body>
      </Router>
    );
  }
}

export default PlayBack;
