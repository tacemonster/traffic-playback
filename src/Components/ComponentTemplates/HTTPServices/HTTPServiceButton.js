import React from "react";
import TemplateStyles from "../TemplateStyles.js";

//This function will most likely get its own .js file since I anticipate
// we may have additional HTTPServiceXXXXXX Components, but for now it is parked
//here.
function sendRequest(url, data, HTTPServiceClient) {
  let request = new XMLHttpRequest();
  alert("Send request function in progress");
}

//This button onClick method sends a request to the server. The server's response
//is caught by the XMLHTTP request in the send request function. The response
//is then passed off to the HTTPServiceCLient which will update the apps state
//accordingly.
function HTTPServiceButton(props) {
  return (
    <button
      HTTPServiceClient={props.HTTPServiceClient}
      onClick={() => {
        sendRequest(props.url, props.data);
      }}
      className={TemplateStyles.HTTPServiceButton}
    >
      {props.children || "Send Request"}
    </button>
  );
}

export default HTTPServiceButton;
