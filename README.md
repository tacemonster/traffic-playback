# Traffic Playback

This tool will allow you to capture a record of traffic going to a website that you own without a delay to users accessing your site, in order to use that data to test out a beta site with accurate traffic flows for your site. You will be able to specify different types of requests to be captured, including setting a timeframe to start and stop recording and specifying specific or regular-expression based values for fields in the requests.

## Getting Set Up

First, you will want to [set up a reverse proxy](https://github.com/tacemonster/traffic-playback/tree/master/Capture/capture_set.md) to capture your network traffic without slowing down access to the site. You will then need to set up the database.

## Product Features

To view the currently implemented features, type
```
node Playback.js --help
```

To view Capture jobs that have been created, type
```
node Playback.js capture-job-list
```

To see the available options of how to start a Capture job thats has been created, type
```
node Playback.js capture-job-start --help
```

To see the available options of how to edit a Capture job thats has been created, type
```
node Playback.js capture-job-edit --help
```

To see the available options and how to start a Playback job, type
```
node Playback.js playback --help
```