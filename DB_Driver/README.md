# Database Drivers

## MySQL
``` bash
npm install mysql
```

## SQL Server
``` bash
npm install mssql
```

## Oracle Database
``` bash
npm install oracledb
```

## Postgres Database

### Install Node.js Dependency
``` bash
npm install pg
```

### Setup Postgres
Install postgres: `sudo apt install postgresql postgresql-contrib`
To login as root: `sudo -u postgres psql`

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
``` bash
npm install mariadb
```