var my_database = require('./mariadb_db_driver').DB_Driver; // import db driver module
const database_driver = new my_database(); // instantiate class
database_driver.connect(); // connect to MariaDB

// run query with Promise object returned
database_driver.query("select * from log where id = 2")
    .then((result) => { // handle response
        console.log(result);
        database_driver.close();  // Must close within then() or catch() when everything is done
    })
    .catch((err) => { // handle error
        console.log(err);
        database_driver.close();  // Must close within then() or catch() when everything is done
    });