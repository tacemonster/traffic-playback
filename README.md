# Traffic Playback

This tool will allow you to capture a record of traffic going to a website that you own without a delay to users accessing your site, in order to use that data to test out a beta site with accurate traffic flows for your site. You will be able to specify different types of requests to be captured, including setting a timeframe to start and stop recording and specifying specific or regular-expression based values for fields in the requests.

## Getting Set Up

First, you will want to [set up a reverse proxy](https://github.com/tacemonster/traffic-playback/tree/master/Capture/capture_set.md) to capture your network traffic without slowing down access to the site. You will then need to set up the database.

## Command-Line Features

The command-line program supports the following four commands, each with their own specific options.

```
Commands:
  Playback capture-job-list   get the list of jobs available to be played back
  Playback capture-job-start  start a capture job
  Playback capture-job-edit   stops a capture job by job
  Playback playback           plays back captured traffic

Options:
  --version   Show version number                                      [boolean]
  -h, --help  Show help                                                [boolean]
```

### List Capture Jobs

To view capture jobs that have been created, type
```
node Playback.js capture-job-list
```

```
Options:
  --version      Show version number                                   [boolean]
  --verbose, -v  Specifies verbosity level                               [count]
  -h, --help     Show help                                             [boolean]
```

### Start a Capture Job

To start a capture job, type

```
node Playback.js capture-job-start [OPTIONS]
```

```
Options:
  --version           Show version number                              [boolean]
  --job-name, -n      (Required) Specifies what the new job will be named.
                                                                        [string]
  --active, -a        Specifies if a job is active (i.e. if it will start
                      capturing traffic upon creation). [Default: true][boolean]
  --job-start         When the job will start in UNIX epoch time.       [number]
  --job-stop          When the job will stop in UNIX epoch time.        [number]
  --secure, -s        PCRE(PHP) formatted regex string. EX: #[0]# to only
                      capture http, #[1]# to only capture https and #[01]# to
                      capture both.                                     [string]
  --protocol, -p      PCRE(PHP) formatted regex string. EX: #HTTP/.*..*#[string]
  --hostname, --host  PCRE(PHP) formatted regex string. EX: #.*.host.com#
                                                                        [string]
  --uri, -p           PCRE(PHP) formatted regex string. EX: #/uri/.*#   [string]
  --method, -p        PCRE(PHP) formatted regex string. EX: #((GET)|(POST))#
                                                                        [string]
  --source-ip, -p     PCRE(PHP) formatted regex string. EX: #.*..*..*..*#
                                                                        [string]
  -h, --help          Show help                                        [boolean]
```

### Edit a Capture Job

To edit an existing capture job, type
```
node Playback.js capture-job-edit [OPTIONS]
```

```
Options:
  --version           Show version number                              [boolean]
  --job-id, -i        (Required) Specify the job ID of the job you wish to edit.
                                                                        [number]
  --job-name, -n      Specifies what the job will be named.             [string]
  --job-start         When the job will start in UNIX epoch time.       [number]
  --job-stop          When the job will stop in UNIX epoch time.        [number]
  --active, -a        This determines whether the capture job is currently
                      running                                          [boolean]
  --secure, -s        PCRE(PHP) formatted regex string. EX: #[0]# to only
                      capture http, #[1]# to only capture https and #[01]# to
                      capture both.                                     [string]
  --protocol, -p      PCRE(PHP) formatted regex string. EX: #HTTP/.*..*#[string]
  --hostname, --host  PCRE(PHP) formatted regex string. EX: #.*.host.com#
                                                                        [string]
  --uri, -u           PCRE(PHP) formatted regex string. EX: #/uri/.*#   [string]
  --method, -m        PCRE(PHP) formatted regex string. EX: #((GET)|(POST))#
                                                                        [string]
  --source-ip, --si   PCRE(PHP) formatted regex string. EX: #.*..*..*..*#
                                                                        [string]
  -h, --help          Show help                                        [boolean]
```

### Start a Playback Job

To see the available options and how to start a playback job, type
```
node Playback.js playback [OPTIONS]
```

```
Options:
  --version                                 Show version number        [boolean]
  --job-id, -i                              (Required) Specifies which job is to
                                            be played back.             [number]
  --playback-speed, --ps                    Specifies the speed at which
                                            requests are played back. [Default:
                                            1]                          [number]
  --port, -p                                Specifies which port to use for HTTP
                                            connections. [Default: 80]  [number]
  --secure-port, -s                         Specifies which port to use for
                                            HTTPS connections. [Default: 443]
                                                                        [number]
  --request-buffer-time, -r                 Specifies the size in milliseconds
                                            of the rolling request schedule
                                            window. [Default: 10000]    [number]
  --target, -t                              Specifies where to send requests to
                                            (i.e. www.domain.com). [Default:
                                            localhost]                  [string]
  --skip-ssl-validity-check, --skip-ssl,    Specifies whether or not to skip the
  --ssvc                                    ssl validity check [Default: true]
                                                                       [boolean]
  --force-host-header, --force-host, --fh   Forces the request header's Host
                                            value to be set to the value
                                            specified by target [Default: false]
                                                                       [boolean]
  --config-file, -c                         Specifies a file containing json
                                            options.                    [string]
  --json, -j                                User-specified json string with
                                            options.                    [string]
  -h, --help                                Show help                  [boolean]
```

Default options have the lowest priority. Options specified in a config file have the next highest priority, followed by
values defined using the json option, and options specified at the command-line level have the highest priority.

The following is the json format expected by the --config-file flag.
```
{
    "jobId": 2,
    "playbackSpeed": 1,
    "port": 80,
    "securePort": 443,
    "requestBufferTime": 10000,
    "target": "localhost",
    "skipSslValidityCheck": true,
    "forceHostHeader": false
}
```

An example of valid json using the --json flag is as follows:
```
"{\"jobId\":2,\"playbackSpeed\":1}"
```