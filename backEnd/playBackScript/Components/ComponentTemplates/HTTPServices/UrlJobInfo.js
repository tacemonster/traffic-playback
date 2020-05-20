import React from "react";

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

export default UrlJobInfo;
