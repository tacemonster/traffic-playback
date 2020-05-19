class HTTPClientFunctions {
  //The init function loads urls and jobs from the database.
  // Anytime this function is called the app,  updates route
  //settings to match the new server data obtained from the json
  static init = async function(resp) {
    return fetch("http://localhost:8000/api/init").then(
      resp => {
        return resp.json().then(json => {
          json.reRender = true;
          return json;
        });
      },
      err => {
        return {
          reRender: true,
          CompletedJobsUrls: { noUrlFound: [] },
          InProgressJobsUrls: { noUrlFound: [] },
          InProgressPlayback: { noUrlFound: [] },
          CompletedPlayback: { noUrlFound: [] }
        };
      }
    );
  };

  //I'm not really ure at the time of writing this function what data it will
  //recieve so I just added some reasonable filler code.
  static runplayback = function(resp) {
    if (resp && resp.status === 200) return true;
    else return false;
  };
}

export default HTTPClientFunctions;
