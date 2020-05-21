# Database Drivers

The current project uses the MySQL driver, and would need to be modified to use a different driver. However, some others have been created in the Other_drivers folder.

## Drivers Available
* MySQL
* MariaDB
* Postgres
* SQL Server
* Oracle Database

## Driver Dependencies
Please run `npm install` on our repo's root to download all dependencies automatically.

OR Manually install the one you need:
```bash
$ npm install mysql     # for MySQL
$ npm install pg        # for postgres
$ npm install mariadb   # for mariaDB
$ npm install mssql     # for SQL Server
$ npm install oracledb  # for oracle database
```

## Driver Example Usage
```javascript
const config = {
    host: "localhost",
    user: "your_db_user_name",
    password: "your_db_password",
    database: "your_database_name",
};
// choose the driver you need here: {mysql_driver, mariadb_driver, postgres_driver, sqlserver_driver, oracle_driver}
const { mysql_driver, mariadb_driver } = require('path_to/DB_Driver');

mysql_driver.connect(config);  // connect to the database
// run query and get result or error back with Promise.
mysql_driver.query('select * from table_name')
    .then(res => {console.log(res); /* ... handle result */ })
    .catch(err => console.log(err); /* ... handle error */);
// run query then handle result or error within callback.
mysql_driver.query_callback('select * from table_name', function (result, error) {
    // ... handle result or error
});
mysql_driver.close();  // close database connection at the end.
```
*** Note: Please refer to the demo file "demo_db_driver.js" for more details and other database drivers.

