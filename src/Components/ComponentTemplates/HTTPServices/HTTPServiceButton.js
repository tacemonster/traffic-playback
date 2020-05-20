import React from "react";
import TemplateStyles from "../TemplateStyles.js";
import { useHistory } from "react-router-dom";

//This function will most likely get its own .js file since I anticipate
// we may have additional HTTPServiceXXXXXX Components, but for now it is parked
//here.
async function sendRequest(APIEndpoint, data, HTTPServiceClient) {
  //DEBUG
  //send an http request to the server.
  return fetch(APIEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(
    //get the response
    resp => {
      //process the http response in the HTTPServiceClient object,
      //if the route does not have a handler assigned to the route.
      //calling this function has no effect.
      return HTTPServiceClient.processHTTPresponse(APIEndpoint, resp);
    },
    err => {
      //I have not written code for handling errors yet.
      //Most likely, ill add proccesHTTPerror function to the HTTPClientEndPoint class.
      alert("placeholder error logging" + err);
      return false;
    }
  );
}

//This button onClick method sends a request to the server. The server's response
//is caught by the XMLHTTP request in the send request function. The response
//is then passed off to the HTTPServiceCLient which will update the apps state
//accordingly.
function HTTPServiceButton(props) {
  let history = useHistory();
  return (
    <button
      onClick={() => {
        sendRequest(props.APIEndPoint, props.data, props.HTTPService).then(
          reRoute => {
            if (reRoute) {
              history.push(props.route || "/");
            } else
              alert(
                "Something went wrong. We're working on better way of notifying the user of failure."
              );
          }
        );
      }}
      className={TemplateStyles.HTTPServiceButton}
    >
      {props.children || "Send Request"}
    </button>
  );
}

export default HTTPServiceButton;
