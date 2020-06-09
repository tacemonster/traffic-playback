# Documentation

This is an internal documentation for installing traffic capturing utility in Linux based OS (ubuntu 18.04, etc). You can install this application in your own machine, or install it in a virtual machine:

- **VirtualBox:** Download from https://www.virtualbox.org/ and download the image of ubuntu server 18.04 from https://ubuntu.com/download/server.
- **AWS Cloud:** https://aws.amazon.com/
- **Google Cloud Platform:** https://cloud.google.com/

## Setup traffic capturing proxy

### Update package manager

```sh
sudo apt update
sudo apt upgrade
```

### Install a LAMP stack (Linux, Apache server, MySQL, PHP)

#### Install tasksel, a tool to install group softwares

```sh
sudo apt -y install tasksel
```

#### Install LAMP server using tasksel

```sh
 sudo tasksel install lamp-server
```

### Install Nginx

```sh
sudo apt install nginx
```

#### Modify configuration file to configure nginx as a reverse proxy

replace server configuration file at **/etc/nginx/sites-available/default** with the following:

`sudo vi /etc/nginx/sites-available/default`

```sh
server {
    listen       80;
    server_name  localhost;

    location / {
        mirror /mirror;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:8080/;
    }

    location /mirror {
        internal;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:8080/traffic_capture.php?secure=$https&proto=$server_protocol&host=$host&uri=$request_uri&method=$request_method;
    }
}
```

**restart Nginx:**

```
sudo service nginx restart
```

#### Change Apache listening port

`sudo vi /etc/apache2/sites-enabled/000-default.conf`

replace `<VirtualHost *:80>` to `<VirtualHost *:8080>`

And,

`sudo vi /etc/apache2/ports.conf`

change the `listen 80` to `listen 8080`

**Note:** Since Nginx is listening port 80 as a reverse proxy and forwarding requests to port 8080, we change Apache server's listening port to 8080 so forwarded requests will be handled via Apache.

**restart Apache:**

```
sudo service apache2 restart
```

## Setup Database

### Complete MySQL installation

run `mysql_secure_installation` in command line to complete MySQL installation if you installed LAMP server via above method. Answer no to the first question and yes to everything else.

### Create database for storing captured requests.

run MySQL command:

```
sudo mysql
```

create a database:

```
create database traffic_log;
```

switch to this database:

```
use traffic_log;
```

create the table:

```
create table log (id int not null auto_increment primary key, utime int not null, sourceip varchar(50), secure varchar(4), proto varchar(15), host varchar(255), uri varchar(255), method varchar(15), headers varchar(1000));
```

setup a new user other than root:

```
create user 'your_username'@'localhost' identified by 'your_password';
grant all privileges on traffic_log.* to 'your_username'@'localhost';
flush privileges;
```

finished, and quit MySQL:

```
quit;
```

## Setup script to store captured traffic

put the file `traffic_capture.php` to the root of your Apache web server. by default, the root will be at `/var/www/html/`. Make sure change your MySQL database's username at `$username = "traffic";` and password at `$password = "12345";` in this file, so it can connect to your database successfully.

Now visit or curl `http://localhost:8080/traffic_capture.php` to confirm if database connected successfully, and then an insert sql query will be displayed and executed and logged into the MySQL database.

Now enter any uri in port 80, `http://localhost/your_uri` will deliver a proxied page via Nginx, and your host IP, protocol, uri, request method, and http headers will be logged into the database.

You can view the logged information via `mysql` command by:

```
sudo mysql;
use traffic_log;
select * from log;
```

## Traffic playback client application

The playback module requires node.js and npm.
You will need to install Node.js and npm on your machine.

For Windows and Mac users who don't have Node or Npm installed, it is recommended to install
Node and npm via the appropriate operating system installer from the following link: https://nodejs.org/en/download/

If possible and applicable to your machine and circumstances, it is recommended that you uninstall outdated versions of node and npm in order to avoid any possible complications and conflicts that may arise due to updating the old version of node.

For Linux users, it is recommended to install node via the command line; however, the command line installations rely on a package manager, so if your system does not have said package manager installed or said package manager is outdated, you will need to update it, or install the package manager in order to install the latest version of node and the accompanying npm version on your system.

Locate your Linux distro and follow the installation instructions in the link below:

https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages

After successful installation, run the commands node -v to display your currently installed version of node, and run
the command npm -v to display your current version of npm. If both commands run successfully, then npm and node are
installed on your system.

To run the playback script, it's easiest to navigate to the folder of Playbackprototype.js via the terminal. When inside said directory run the command node Playbackprototype.js

## Nginx SSL Setup

​

### Step 1: Check if you have openssl installed.

​
On ubuntu run this command:
​

```
openssl version -a
```

​
If openssl isn’t installed run this command to install it:
​

```
sudo apt-get install openssl
```

​

### Step 2: Register a new key.

​
Run this command:
​

```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```

​

#### Note from the above command. We used the following paths public and private key storage. You can change the path as you wish.

​

1.  /etc/ssl/private/nginx-selfsigned.key
2.  /etc/ssl/certs/nginx-selfsigned.crt
    ​
    When you run the above command, you will be prompted to answer a series of questions regarding your new keys. The only question that is required is the **hostname**. In our case we used **‘localhost’**. However, you can enter any domain you wish.
    ​
    You have completed setting up the keys. If you wish, you may go to the path where your keys are stored to check.
    ​

### Step 3: Setting up Nginx config to work with ssl.

​
Starting from the Ubuntu root. Go to this folder:
​

```
/etc/nginx/conf.d
```

​
Copy and paste the **default.conf** file with this example file here:
​
[link to Example Nginx SSL config!](https://github.com/tacemonster/traffic-playback/blob/ssl-capture/Capture/NGINX%20Configuration/example)
​
Run this command to restart nginx:
​

```
service nginx restart
```

​
You now have ssl installed with nginx.

## Express Server FrontEnd Setup

### Step 1: Check that you have node and npm installed

Run this command in terminal to check if you have node already installed.

```
node -v
```

And this command to check if npm is already installed.

```
npm -v
```

If you have both node and npm installed, please skip to **Step 2**.

To install both nodejs and npm package manager, run this command.

```
npm install npm@latest -g
```

### Step 2: Install and run create-react-app library

**Create React App** is a tool (built by developers at Facebook) that gives you a massive head start when building React apps. It saves you from time-consuming setup and configuration. You simply run one command and Create React App sets up the tools you need to start your React project.

Run this command to install **Create React App**.

```
npm install create-react-app
```

Then you can simply create a new react project with this command.

```
create-react-app myFirstReactApp
```

Go to your myFristReactApp directory and run this command to start your app.

```
npm start
```

A server at localhost:3000 will pop up with a welcome message.

### Step 3: Import the UI and dependencies

Stop your react server by pressing **control c** together. Now, locate the **src** folder in traffic-playback parent folder. You should have traffic-playback folder when you clone this project directory. Copy and paste the **src** folder into your **myFirstReactApp** folder and overwrite it.

Then, you need to install all of these dependencies.

React Router Dom.

```
npm i react-router-dom
```

Axios:

```
npm i axios
```

React Date Picker:

```

npm i react-datepicker

```

ReactStrap for layout:

```

npm i reactstrap

```

React Bootstrap:

```

npm i react-bootstrap

```

Input Validation Joi:

```

npm i joi

```

Input Validation for Joi-Browser:

```

npm i joi-browser

```

ChartJs

```

npm i react-chartjs-2

```

Once you have completed installing all the dependencies, restart react server with this command:

```

npm start

```

You should see the new changes. If there are dependencies errors, please install the dependencies like we did above.

That's it! You have completed setting up the react app.

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

### UI Setup

### Dependencies

After cloning the repo from Github,  open the traffic_playback directory in the command line terminal and run the following command:

```
npm install
```

This command reads the contents of the package.json file, and installs all UI dependencies.


### Building The App and Linking it With The Back End Server

After all dependencies have been installed, building the app is easy. Run the command:

```
npm run-script build
```

This command builds the react app, but it is vital that you are inside the uppermost level of the traffic_playback directory. The output of the build command, a build folder, is what used in production. This build folder is automatically placed into the server directory, backEnd, if and only if a build folder already exist in the backEnd directory. The previous build folder is automatically removed. If a build folder
does not exist in the backEnd directory, then the build folder will be placed in the uppermost traffic_playback directory, and the developer
will need to manually drag into the backEnd directory. This automated service only works on Linux machines. Windows and Mac users must drag
and drop.

### Running The App With The Server

After the app has been built and moved into the backEnd folder. Enter the backEnd folder and run the command:

```
node index.js.
```

This command will start a node process on localhost on localhost:7999. This process acts like a webserver. If running this app on a local machine, enter http://localhost:7999/ into the adress bar. If running this app remotely, enter http://remoteserverURL:7999/ and the app’s homepage will display.


### Adding Pages To The UI

In App.js, add a json with the following formatting inside the array assigned to the navLinks property: 
{ title: "Link Title", route: "/linkroute" }.

This statement adds a link to the navbar. The next step is to render a component at /linkroute.

To do this, open Playback.js  and add :
Route exact path="/linkroute" component={linkrouteComponent} /Route   
inside the Switch> /Switch of the render method.



