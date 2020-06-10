## Express Node Server Backend Setup

### Step 1: Set up Node and Nodemon

If you have follow the instruction on setting up React app, you should have Nodejs installed already. Otherwise, you can go the **Express Server FrontEnd Setup** Step 1 to set up Nodejs.

From the traffic-playback folder (this project clone), go to the **backEnd** folder. Install nodemon with this command:

```
npm i nodemon
```

### Step 2: Set up dependencies

Install express:

```
npm i express
```

Joi input validator:

```
npm i joi
```

Mysql driver:

```
npm i mysql
```

Cors for running mulitple node server:

```
npm i cors
```

Axios to make http request:

```
npm i axios
```

Once you have completed installing all the dependencies, restart the express node server with this command:

```
nodemon index.js
```

You should see the new changes. If there are dependencies errors, please install the dependencies like we did above.

To stop the server press \*control c\*\* together.

That's it! You have completed setting up the express node server backend.
