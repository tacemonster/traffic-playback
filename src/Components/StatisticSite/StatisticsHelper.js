import Routes from '../Playback/Routes';

// this helper class is used to help any common task that stats site needs.
// make backend API call, etc
class StatisticsHelper {
    static host = '';

    /**
     * get all jobs information from the server
     */
    static getAllJobID() {
        // let url = Routes;
        let url = StatisticsHelper.host + '/api/capture/jobs';
        return callAPI(url);
    }

    /**
     * get traffic data (jobID, utime, uri) for a specific job
     * @param {*} id job ID
     */
    static getAllUriByJobID(id) {
        id = parseInt(id);
        let url = StatisticsHelper.host + '/api/play/stats';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                jobID: id
            }),
        };
        return callAPI(url, options);
    }

    /**
     * get all traffic data for real time monitor
     * @param {*} id job ID. If exists, get traffic for relative job, otherwise get all traffics for all jobs
     * @param {*} limit record limit. If exists, get limited number of records, otherwise get all records from the database
     */
    static getAllTrafficByJobID(id, limit) {
        let jobID = (id ? parseInt(id) : null);
        let fetchLimit = (limit ? parseInt(limit) : null);
        let url = StatisticsHelper.host + '/api/play/realtime';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                jobID: jobID,
                limit: fetchLimit
            }),
        };
        return callAPI(url, options);
    }

    /**
     * get a random color in rgb format, used for line color in the line chart.
     */
    static getRandomColor() {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
}

// call backend server
function callAPI(url, option) {
    return new Promise((resolve, reject) => {
        fetch(url, option)
            .then((res) => {
                if (res.json) {
                    return res.json().then((json) => {
                        return res.ok ? json : reject(json);
                    });
                } else {
                    reject('No JSON exist!');
                }
            })
            .then((result) => {
                // console.log(result);
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

export default StatisticsHelper;
