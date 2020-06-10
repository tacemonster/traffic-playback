# Setup Traffic Capture

## With existing NGINX proxy:

-Setup a LAMP (apache) or LEMP (nginx) server to host traffic capture.
[LAMP setup instructions](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04)
[LEMP setup instructions](https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04)

## Without existing NGINX proxy:

-Setup a LEMP server to function as a reverse proxy and host traffic capture.
[LEMP setup instructions](https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04)

## Configure NGINX Reverse Proxy

Begin by setting up the nginx configuration to function as a reverse proxy for the http(s) website or service you wish to capture.

The configuration file is found at **/etc/nginx/sites-available/default**, and should be edited or replaced to mimic the following example.

**Example nginx server directives**

***
Disclaimer: These server directives are a simple demonstration of traffic capture functionality and are not guaranteed to be fully functional or secure in a production environment. Use your best judgement and ensure your implementation is correct.
***

*http:*

``` sh
server {
        listen 80;
        server_name example.domain;

        location / {
                mirror /tpt-mirror;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_pass http://original_server_ip:port/;
        }

        location /tpt-mirror {
                internal;
                proxy_set_header Host $host;
                proxy_set_header tpt-ip $remote_addr;
                proxy_set_header tpt-secure $https;
                proxy_set_header tpt-proto $server_protocol;
                proxy_set_header tpt-host $host;
                proxy_set_header tpt-uri $request_uri;
                proxy_set_header tpt-method $request_method;
                proxy_set_header tpt-requesttime $msec;
                proxy_pass http://capture_server_ip:port/traffic_capture.php;
        }
}
```

*https:*

``` sh
server{
        listen 443;
        server_name example.domain;

        ssl on;
        ssl_certificate /path/to/ssl/cert;
        ssl_certificate_key /path/to/ssl/key;

        location / {
                mirror /tpt-mirror;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_ssl_server_name on;
                proxy_pass https://original_server_ip:port/;
        }

        location /tpt-mirror {
                internal;
                proxy_set_header Host $host;
                proxy_set_header tpt-ip $remote_addr;
                proxy_set_header tpt-secure $https;
                proxy_set_header tpt-proto $server_protocol;
                proxy_set_header tpt-host $host;
                proxy_set_header tpt-uri $request_uri;
                proxy_set_header tpt-method $request_method;
                proxy_set_header tpt-requesttime $msec;
                proxy_pass http://capture_server_ip:port/traffic_capture.php;
        }
}
```

-If you are editing an existing reverse proxy configuration and do not want to simply replace the existing configuration file, the important part here is to use the nginx-mirror module `mirror /tpt-mirror` in your reverse proxy location handler, and create a  `location /tpt-mirror` configuration block to dispatch the request for capture logging.

## Optional: Set up SSL verification

If you want to set up SSL verification for your proxy server, directions can be found [here](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/ssl.md).

## Set up the database

Edit the file setup_mysql.sql to set a username and password for the project, then run
```
mysql trafficDB < sql/setup_mysql.sql
```
to set up the database.

While you're here, go ahead and add the same values to your .env file for the playback script to grab.

## Install & configure capture script

The traffic capture PHP script simply has to be hosted so its accessible to the NGINX reverse proxy. The LEMP installation process sets up NGINX + php_fpm or you can use an apache-based LAMP stack instead.

**Example nginx traffic_capture server**

This server listens on port 8181 and is used to host traffic_capture.php in the root directory `/var/www/traffic_capture/`

``` sh
server {
        listen 8181;
        server_name localhost;
        root /var/www/traffic_capture/;

        location ~ [^/]\.php(/|$) {
                fastcgi_split_path_info ^(.+?\.php)(/.*)$;
                if (!-f $document_root$fastcgi_script_name) {
                        return 404;
                }

                fastcgi_pass unix:/run/php/php-fpm.sock;
                fastcgi_index index.php;

                include fastcgi_params;
                
 fastcgi_param  SCRIPT_FILENAME   $document_root$fastcgi_script_name;
        }
}
```

Insert your mysql database connection info into the `traffic_capture.php` script:

``` sh
<?php
//Database configuration
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$database = "database_name";
//End script configuration block
```

# Set up playback

Install [Node.js](https://nodejs.org/en/download/package-manager/)

In the root of the repository, run 
```
npm install
```

# Pick your interface

If you want to use the Blaster from the command line, you're all set up at this point. Checkout the [Command line interface](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/command-line.md) documentation here for information about features and use.

If you'd prefer the graphical UI, check out the [user interface setup](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/UIsetup.md) instructions here, then the [UI usage documentation](https://github.com/tacemonster/traffic-playback/tree/master/Dcoumentation/user-interface.md) once you're set up.