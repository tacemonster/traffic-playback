## API Routes Documentation

### Name:

Jobs

### Description:

Get a list of capture jobs

### Route:

```
api/capture/jobs
```

### Input:

None

### Output:

Json object

### Allowed HTTPs requests:

GET

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.

### Name:

Capture job status.

### Description:

Get a list of capturing jobs status.

## Route:

```
api/capture/status
```

### Input:

None

### Output:

Json object

### Allowed HTTPs requests:

GET

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.

### Name:

Capture Job

### Description:

Create a capture job

### Route:

```
api/capture/createJob
```

### Input:

• jobName (String) : unique identifier, required.
• jobStart (Number) : Start time in utime.
• jobStop (Number) : End time in utime.
• secure (Number) : 0 = unsecure, 1 = secure.
• protocol (String) : HTTP, HTTPS
• host (String) : Host name.
• uri (String) : URI path.
• method (String) : GET, POST, HEAD, PUT, DELETE.
• sourceip (Digit) : IP address.

### Output:

Json object

### Allowed HTTPs requests:

POST

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.

### Name:

Playback Job

### Description:

Playback a capture job

### Route:

```
api/play/run
```

### Input:

• jobId (String) : unique identifier, required.
• verbose(Number): Debugging.
• playbackSpeed(Number): Playback speed.
• port(Number): HTTP port.
• securePort(Number): HTTPS port.
• requestBufferTime(Number): Buffer size.
• hostname (String) : Hostname.
• backendServer(String) : Server to playback traffic.
• playbackName (String) : Playback job name, required.

### Output:

Json object

### Allowed HTTPs requests:

POST

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.

### Name:

Playback Status

### Description:

Get playback jobs status

### Route:

```
api/play/status
```

### Input:

None

### Output:

Json object

### Allowed HTTPs requests:

GET

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.

### Name:

Stats

### Description:

Statistics Information

### Route:

```
api/play/stats
```

### Input:

None

### Output:

Json object

### Allowed HTTPs requests:

POST

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.

### Name:

Real Time

### Description:

Get real time traffic captured.

### Route:

```
api/play/realtime
```

### Input:

• jobId (Number) : unique identifier, required.
• limit(Number): Set return limit.

### Output:

Json object

### Allowed HTTPs requests:

POST

### Description Of Usual Server Responses:

• 200 OK - the request was successful (some API calls may return 201 instead).
• 400 Bad Request - the request could not be understood or was missing required parameters.
