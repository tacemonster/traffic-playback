#UI Setup

## Dependencies

After cloning the repo from Github,  open the traffic_playback directory in the command line terminal and run the following command:

```
npm install
```

This command reads the contents of the package.json file, and installs all UI dependencies.


## Building The App and Linking it With The Back End Server

After all dependencies have been installed, building the app is easy. Run the command:

```
npm run-script build
```

This command builds the react app, but it is vital that you are inside the uppermost level of the traffic_playback directory. The output of the build command, a build folder, is what used in production. This build folder is automatically placed into the server directory, backEnd, if and only if a build folder already exist in the backEnd directory. The previous build folder is automatically removed. If a build folder
does not exist in the backEnd directory, then the build folder will be placed in the uppermost traffic_playback directory, and the developer
will need to manually drag into the backEnd directory. This automated service only works on Linux machines. Windows and Mac users must drag
and drop.

## Running The App With The Server

After the app has been built and moved into the backEnd folder. Enter the backEnd folder and run the command:

```
node index.js.
```

This command will start a node process on localhost on localhost:7999. This process acts like a webserver. If running this app on a local machine, enter http://localhost:7999/ into the adress bar. If running this app remotely, enter http://remoteserverURL:7999/ and the app’s homepage will display.


# Adding Pages To The UI

In App.js, add a json with the following formatting inside the array assigned to the navLinks property: 
{ title: "Link Title", route: "/linkroute" }.

This statement adds a link to the navbar. The next step is to render a component at /linkroute.

To do this, open Playback.js  and add :
Route exact path="/linkroute" component={linkrouteComponent} /Route   
inside the Switch /Switch of the render method.



