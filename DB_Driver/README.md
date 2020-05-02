# Database Drivers

## MySQL
install Node.js Dependency:
``` bash
npm install mysql
```

## SQL Server
install Node.js Dependency:
``` bash
npm install mssql
```

## Oracle Database
install Node.js Dependency:
``` bash
npm install oracledb
```

## Postgres Database

Install Node.js Dependency
``` bash
npm install pg
```

Setup Postgres
Install postgres: 
``` bash
$ sudo apt install postgresql postgresql-contrib
```
To login as root: 
```
$ sudo -u postgres psql
```
run the following:
```
postgres=# CREATE DATABASE traffic_log;
postgres=# create role traffic;
postgres=# alter role "traffic" with LOGIN;
postgres=# alter role traffic with password '12345';
postgres=# GRANT ALL PRIVILEGES ON DATABASE traffic_log to traffic;
postgres=# \c traffic_log
traffic_log=# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO traffic;
```

To login as traffic: 
```
psql -U traffic -h localhost -d traffic_log
password: 12345
```

## MariaDB
install Node.js Dependency:
``` bash
npm install mariadb
```

to install MariaDB:
``` bash
$ sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
$ sudo add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://ftp.utexas.edu/mariadb/repo/10.3/ubuntu bionic main'
$ sudo apt update
$ sudo apt install mariadb-server
$ mysql_secure_installation
```

to login:
```
$ mysql -u root -p
```
