var mssql = require('./sqlserver_db_driver');

// config for your database
const configuration = {
    user: 'sa',
    password: 'your_password',
    server: 'localhost',
    database: 'traffic'
};

mssql.connect(configuration);
mssql.query('select * from log')
    .then(result => console.log(result))
    .catch(error => console.log(error));