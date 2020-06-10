# Traffic Playback

This tool will allow you to capture a record of traffic going to a website that you own without a delay to users accessing your site, in order to use that data to test out a beta site with accurate traffic flows for your site. You will be able to specify different types of requests to be captured, including setting a timeframe to start and stop recording and specifying specific or regular-expression based values for fields in the requests.

## Getting Set Up

First, you will want to [set up a reverse proxy](https://github.com/tacemonster/traffic-playback/tree/master/Capture/capture_set.md) to capture your network traffic without slowing down access to the site. You will then need to set up the database.