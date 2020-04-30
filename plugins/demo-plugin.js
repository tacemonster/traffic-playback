var methods = require('../PlaybackPrototype.js');

methods.register_hook(1, methods.hook_events.PRE_REQUEST, () => console.log('In plugin hook with priority 1'))

// Commented out part just shows that the variables that are supposed to be passed into these hooks can be received
methods.register_hook(420, methods.hook_events.REQUEST_CALLBACK, (res) => { console.log('In plugin hook with priority 420'); /* console.log(res) */ })

methods.register_hook(69, methods.hook_events.PRE_REQUEST, () => console.log('In plugin hook with priority 69'))