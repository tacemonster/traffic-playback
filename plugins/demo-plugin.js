const methods = require('../Playback.js');

// You have access to the register_hook function which will add your function to the hooks list and
// the hook_events object which is a enum containing all the events where a hook can be put.

// methods.register_hook(1, methods.hook_events.PRE_REQUEST, () => console.log('In plugin hook with priority 1'))

// // Commented out part just shows that the variables that are supposed to be passed into these hooks can be received
// methods.register_hook(40, methods.hook_events.REQUEST_CALLBACK, (res) => { console.log('In plugin hook with priority 40'); /* console.log(res) */ })

// methods.register_hook(9, methods.hook_events.PRE_REQUEST, () => console.log('In plugin hook with priority 9'))