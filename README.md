# ASYNCHRONOUS SERVER BLASTER

Have you ever worried about (or experienced) failures on your website after releasing a new version of the site? Maybe you acquired a domain name but the server hosting it is off-site (or in an unknown location?!). Maybe you just like thorough testing using your own actual data before you change things in production, or want to keep your own metrics about vistiors to your site. If any of these apply to you, then the Asynchronous Server Blaster is just the project for you.

This tool will allow you to capture records of traffic going to a domain that you own without a delay to your users. You will be able to specify different types of requests to be captured, including setting a timeframe to start and stop recording and specifying specific, regular expression-based values for fields in the requests. By changing options before playback, you can simulate changes to your traffic flow, or play it back as-is with requests timed as closely as computer-ly possible to match their original incoming times. You'll also get statistics about your captured traffic and a real-time monitor to watch those sweet, sweet requests rolling in.

While the Blaster is not a replacement for thorough manual testing, we hope that you will enjoy its ease of use and get those launches out without worrying about the performance of your server.

## Getting Set Up

Use the [set up guide](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/setup.md) and the other documents linked in it to get the Asynchronous Server Blaster ready for use.

## Product Features

This product offers both a graphical user interface and a command-line interface.

You can set up capture to be as wide or as narrow as you want: pick start and end dates or leave them off and capture indefinitely, specify restrictions to all the fields of requests you want to capture using regualr expressions, and create your jobs! Set up many different capture jobs or just one universal job to capture everything.

When you're ready to play the captured requests at your beta site, you can double the playback time to simulate traffic doubling on your domain or send your requests to a specific port as needed. Want or need to disable SSL checks? You've got it!

Our UI also has bonus features. Traffic statistics show you up-to-date counts of the data you've captured by URI and an interactive graph to show you traffic by day on any URI of interest, and the real-time monitor updates at the interval of your choosing, showing you the most recently captured data.

View the [UI usage documentation](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/UISetup.md) for details about using the graphical user interface, or the [command-line interface](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/command-line.md) document to see how to use the product at the command line.

## Expanding the Blast

If you want to add features to the Asynchronous Server Blaster, check out the documentation on the [plug-in API](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/plugin-api.md) and the [back end API](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/API.md). If you want to add a new UI page, see [how to add a new component](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/AddNewComponent.md). 

If databases are your thing and our schema isn't quite what you need, the [database schema documentation](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/SQL.md) has detailed comments about how our database works, and the [database schema diagram](https://github.com/tacemonster/traffic-playback/tree/master/sql/TrafficDB-v3.md) might also be helpful.




Asynchronous Server Blaster created by Tacy Bechtel, Zack Davis, Christopher Douglass, Jordan Green, Berin Hadziabdic, Medina Lamkin, Huanxiang Su and James Vo, 2020.