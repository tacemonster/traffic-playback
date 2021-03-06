# How to use the Asynchronous Server Blaster UI


# UI Capture Job Screen

This page allows you to maniupulate the settings involved with request capture.

# TODO INSERT IMAGE

## Job Name
This field is required and should be unique. Use this to reference the job.

## Start Date
This is the start date for the capture job. No requests will be captured as part of this job if they are recieved before this date.

## End Date
This is the end date for the capture job. No requests will be captured as part of this job if they are recieved after this date.

## Security Setting
Choose whether to capture only insecure, only secure or both insecure and secure (any) request types.

# Optional REGEX Filters
These filters are optional. If you choose to not use a field, leave the field blank and the filter will be skipped. Regex should be formatted as PCRE(PHP) format, with wrapping delimiters included.

## Networking Protocol
This field accepts a PCRE(PHP) formatted regular expression, and filters based on the protocol that requests declare. For example, '#HTTP\/.\*\..\*# will match HTTP/1.1 and HTTP/2.0.

## Hostname
This field accepts a PCRE(PHP) formatted regular expression, and filters based on the hostname (domain portion of the URL) that requests have. For example, #.\*\.host\.com# will match wildcard.host.com.

## URI
This field accepts a PCRE(PHP) formatted regular expression, and filters based on the URI (path portion of the request) that requests have. For example, #\/uri\/.*# will match the uri /uri/anyscript.php.

## Source IP
This field accepts a PCRE(PHP) formatted regular expression, and filters based on the ip address where the request originated. For example, #.\*\..\*\..\*\..\*# will match any IPv4 IP address. This also supports filtering on IPv6 addresses.

## Method
This field accepts a PCRE(PHP) formatted regular expression, and filters based on the HTTP request method (GET, POST, PUT, ...). For example, #((GET)|(POST))# will match GET and POST requests but not capture any other type.


# UI Run Job Screen

This page allows you to run previously captured or in progress jobs. You can then select a job from the list of available jobs to deploy. This will take you to a page where you can configure the job before running it.

## Playback Speed
Adjust the speed at which to playback the captured traffic to see how your site will manage increases and decreases in traffic. This is a multiple of the original speed. Default is 1 (the original speed).

## Port
Specify which port to use for HTTP connections. Default is port 8080.

## Secure Port
Specify which port to use for HTTPS connections. Default is port 443.

## Request Buffer Time
Specifies the size in milliseconds of the rolling request schedule window. Default is 10000 milliseconds.

## Host Name
Choose a host to send requests to.


# UI Statistics Screen

This page will show you a graph of traffic captured for a chosen URI. Modifications and introduction of new statistics can be done by editing src/Components/StatisticSite/TrafficStatistic.js

Select your URI. Choose the start date and end date for the time frame you want to view traffic to your URI. Any window in the selected time frame for which the Asynchronous Server Blaster was not set to capture traffic to the URI will show 0 requests.


# UI Real Time Monitor Screen

This page will show you a real time monitor for jobs that are currently in progress. Includes various options to change what is displayed on the table; options and their default values can be changed at src/Components/StatisticSite/RealTime.js.

## Select a Job to View Real Time Traffic 
If no jobs are in progress, visit the Capture Job page and start capturing some traffic! If the capture timeframe is long enough, you'll be able to come back to the Real Time Monitor page and select your new job.

## Information Displayed on Table
Choose what fields to display. The fields are: recordID, jobID, jobName, date, host, uri, method, protocol, secure, sourceip, reqBody, and header; these can be set at capture time. Default includes the recordID, jobName, date, host, uri, and method fields.

## Number of Records Displayed in Table
Allows you to limit the number of records displayed on one page of the table. Default is 50 records.

## Update Time
This determines how frequently the table will be refreshed. Default is 60 seconds in between refreshes. You will be able to see a countdown until the next refresh.


# Add new component to UI

1- Update the nav bar by appending to the navLinks list in src/App.js, giving your new page an appropriate title and a route. 

2- Create you new react component and import it into src/Components/Playback/Playback.js. Add route to render(), using the same route chosen in step 1 as your exact path.
   