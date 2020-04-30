var methods = require('../PlaybackPrototype.js');

methods.register_hook(1, methods.hook_events.PRE_REQUEST, () => console.log('In plugin hook with priority 1'))

methods.register_hook(420, methods.hook_events.REQUEST_CALLBACK, () => console.log('In plugin hook with priority 420'))

methods.register_hook(69, methods.hook_events.PRE_REQUEST, () => console.log('In plugin hook with priority 69'))