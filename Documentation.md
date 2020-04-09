# Documentation

This is an internal documentation for installing traffic capturing utility in Linux based OS (ubuntu 18.04, etc). You can install this application in your own machine, or install it in a virtual machine:
* **VirtualBox:** Download from https://www.virtualbox.org/ and download the image of ubuntu server 18.04 from https://ubuntu.com/download/server.
* **AWS Cloud:** https://aws.amazon.com/
* **Google Cloud Platform:** https://cloud.google.com/


## Setup traffic capturing proxy

### Update package manager
``` sh
sudo apt update
sudo apt upgrade
```

### Install a LAMP stack (Linux, Apache server, MySQL, PHP)
#### Install tasksel, a tool to install group softwares
``` sh
sudo apt -y install tasksel 
```
#### Install LAMP server using tasksel
``` sh
 sudo tasksel install lamp-server 
``` 

### Install Nginx
``` sh
sudo apt install nginx 
```

#### Modify configuration file to configure nginx as a reverse proxy
replace server configuration file at **/etc/sites-available/default** with the following:

` sudo vi /etc/sites-available/default`

``` sh
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

For Linux users, it is recommended to install node via the command line; however, the command line installations rely on a package manager, so if your system does not have said package manager installed or said package manager is outdated, you will need to update it, or install the package manager in order to install the latest version  of node and the accompanying npm version on your system.

Locate your Linux distro and follow the installation instructions in the link below:

https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages


After successful installation, run the commands node -v to display your currently installed version of node, and run
the command npm -v to display your current version of npm. If both commands run successfully, then npm and node are
installed on your system.

To run the playback script, it's easiest to navigate to the folder of Playbackprototype.js via the terminal. When inside said directory run the command node Playbackprototype.js
