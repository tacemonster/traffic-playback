# Traffic Playback

This tool will allow you to capture a record of traffic going to a website that you own without a delay to users accessing your site, in order to use that data to test out a beta site with accurate traffic flows for your site. You will be able to specify different types of requests to be captured, including setting a timeframe to start and stop recording and specifying specific or regular-expression based values for fields in the requests.

## Getting Set Up

Use the [set up guide](https://github.com/tacemonster/traffic-playback/tree/master/documentation/setup.md) to get the Asynchronous Server Blaster ready for use.

## Product Features

This product offers both a graphical user interface and a command-line interface.

You can set up capture to be as wide or as narrow as you want: pick start and end dates or leave them off and capture indefinitely, specify restrictions to all the fields of requests you want to capture using regualr expressions, and create your jobs! Set up many different capture jobs or just one universal job to capture everything.

When you're ready to play the captured requests at your beta site, you can double the playback time to simulate traffic doubling on your domain or send your requests to a specific port as needed. Want or need to disable SSL checks? You've got it!

Our UI also has bonus features. Traffic statistics show you up-to-date counts of the data you've captured by URI and an interactive graph to show you traffic by day on any URI of interest, and the real-time monitor updates at the interval of your choosing, showing you the most recently captured data.

View the [UI usage documentation](https://github.com/tacemonster/traffic-playback/tree/master/documentation/??????.md) for details about using the graphical user interface, or the [command-line interface](https://github.com/tacemonster/traffic-playback/tree/master/documentation/command-line.md) document to see how to use the product at the command line