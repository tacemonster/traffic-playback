#Setup Traffic Capture

##With existing NGINX proxy:

Setup a LAMP (apache) or LEMP (nginx) server to host traffic capture.

**LAMP:**
https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04

**LEMP:**
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04

##Without existing NGINX proxy:

Setup a LEMP server to function as a reverse proxy and host traffic capture.

**LEMP:**
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04

##Configure NGINX Reverse Proxy

Begin by setting up the nginx configuration to function as a reverse proxy for the http(s) website or service you wish to capture.

**Example nginx server directives**

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

If you are editing an existing reverse proxy configuration, the important part here is to use the nginx-mirror module `mirror /tpt-mirror` in your reverse proxy location handler, and create a  `location /tpt-mirror` configuration block to dispatch the request for capture logging.

##TODO: Should probably install & configure the database & database user here.

##Install & configure capture script

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
$username = "some_user";
$password = "random_password";
$database = "database_name";
//End script configuration block
```