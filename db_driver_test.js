var my_database = require('./db_driver').DB_Driver;
const database_driver = new my_database();

database_driver.hello();
database_driver.connect();

database_driver.query("select * from log where id = 2")
    .then((result) => { console.log(result); })
    .catch((err) => console.log(err));

database_driver.query("select * from log where id = 3")
    .then(handleResponse)
    .catch(handleError);

database_driver.query_get_all().then(handleResponse).catch(handleError);

function handleResponse(res) {
    console.log(res);
}

function handleError(e) {
    console.log(e);
}

database_driver.disconnect();