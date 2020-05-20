import Routes from "../../Playback/Routes";

class HTTPClientFunctions {
  //The init function loads urls and jobs from the database.
  // Anytime this function is called the app,  updates route
  //settings to match the new server data obtained from the json
  static init = async function(resp) {
    return fetch(Routes.init).then(
      resp => {
        return resp.json().then(json => {
          json.reRender = true;
          return json;
        });
      },
      err => {
        return {
          reRender: true,
          jobs: []
        };
      }
    );
  };

  //This function returns a true/false which indicates whether or not running a new
  //job is succesful.
  static runplayback = function(resp) {
    if (resp && resp.status === 200) return true;
    else return false;
  };

  //This function returns a true/false which indicates whether or not creating a new job
  //job is succesful.
  static createjob = function(resp) {
    if (resp && resp.status === 200) return true;
    else return false;
  };
}

export default HTTPClientFunctions;
