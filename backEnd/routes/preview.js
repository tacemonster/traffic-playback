const express = require('express');
const http = require('http');
const router = express.Router();
const mysqlDriver = require('../../DB_Driver').mysql_driver;

const config = {
    host: 'localhost',
    user: 'traffic',
    password: '12345',
    database: 'trafficDB',
    multipleSatements: true,
};

router.get('/', (req, res) => {
    let id = req.query.id;
    if (id && id !== '') {
        mysqlDriver.connect(config);
        mysqlDriver.query(`select * from raw where id = ${id}`)
            .then((row) => {
                let options = row[0];
                dispatch_request(options, res);
            })
            .catch((err) => {
                res.end('No preview Available!');
            });
        mysqlDriver.close();
    }
});

function dispatch_request(options, res){
    var req_options = {
        //host: options.host,
        host: 'localhost',
        port: '8080',
        path: options.uri,
        method: options.method,
    };
    var request = http.request(req_options, (ress) => {
        let str = '';
        ress.on('data', (data) => { str += data; });
        ress.on('end', () => {
            res.send(str);
            res.end();
        });
    });
    if (options.reqbody !== '') {
        request.write(options.reqbody);
    }
    request.on('error', (e) => {
        // console.log(e);
        res.end('No preview available!');
    });
    request.end();
}

module.exports = router;