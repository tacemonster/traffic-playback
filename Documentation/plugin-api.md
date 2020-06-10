# Plug-in API
The plug-in API is designed such that developers can use the register_hook() function to key into parts of the playback
script, without having to alter the source code directly.

## Register a Plug-in
To register a plug-in, first create a new file in the [[/plugins](https://github.com/tacemonster/traffic-playback/tree/master/plugins)] directory and add a line like this to the [[index.js](https://github.com/tacemonster/traffic-playback/blob/master/plugins/index.js)] file so it will be
picked up by the playback script.
```
exports.demo_plugin = require('./demo-plugin.js')
```
Inside the file, use the register hook function to register functions that will be called any time a hook event is fired.
```
function register_hook(priority, event_type, func)
```
```
priority   - integer value,
event_type - { hook_events.PRE_REQUEST, hook_events.REQUEST_CALLBACK, hook_events.POST_REQUEST }
func       - function to call when a hook event is fired
```
For a more in-depth example, take a look at the demo plugins [[demo-plugin.js](https://github.com/tacemonster/traffic-playback/blob/master/plugins/demo-plugin.js)]


## Event Types

### Pre-Request Hook
The pre-request hook gives developers access to the read-only options (containing the raw data from a given SQL row),
several editable options the developer can change, as well as full control over the request options.
```
function pre_request_hook(options, editable_options, req_options)
```

### Request Callback Hook
The request callback hook gives developers the ability to add callback functions on the response object.
```
function request_callback_hook(res)
```


### Post-Request Hook
The post-request hook gives developers the request after its sent to allow for any post-processing that may be needed.
```
function post_request_hook(req, options)
```

