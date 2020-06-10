var methods = require('../PlaybackPrototype.js');

methods.register_hook(42069, methods.hook_events.POST_REQUEST, () => console.log('In plugin hook with priority 42069'))