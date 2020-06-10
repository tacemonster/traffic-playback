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

You now have ssl installed with nginx.
