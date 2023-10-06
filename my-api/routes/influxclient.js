var express = require('express');
var router = express.Router();
var Influx = require('influx');


router.post("/", async function (req, res, next) {
    const host = req.body.host
    const database = req.body.database
    const influx = new Influx.InfluxDB({
        host: host,
        database: database,
    
    })
    console.log(req.body);
    const query = req.body.query
    const result = await influx.query(query)
    res.send(result)
}
)

module.exports = router;