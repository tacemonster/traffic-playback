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