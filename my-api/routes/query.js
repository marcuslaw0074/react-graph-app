var express = require("express");
var neo4j = require("neo4j-driver");
var router = express.Router();

const getNodesAndRelas = (ls) => {
  return [ls[0].properties.name, ls[1].type, ls[2].properties.name];
};

/* GET users listing. */
router.post("/", async function (req, res, next) {
  if (req.body.query.toLowerCase().includes("delete")) {
    return null;
  }
  // 192.168.100.214:27687
  var driver = neo4j.driver(
    "bolt://192.168.8.125:7691",
    neo4j.auth.basic("neo4j", "test"),
    {
      maxTransactionRetryTime: 30000,
    }
  );
  var session = driver.session({ database: "neo4j" });
  result = await session
    .readTransaction((txc) => txc.run(req.body.query))
    .then((res) => {
      var data = res.records.map((ele) => {
        return getNodesAndRelas(ele._fields);
      });
      var ls = [
        ...data.map((ele) => {
          return ele[0];
        }),
        ...data.map((ele) => {
          return ele[2];
        }),
      ];
      return data;
    });

  res.send(result);
}).post("/id/", async function (req, res, next) {
  console.log(req.body)
  if (typeof req.body.id !== "undefined" ) {
    var id = req.body.id.replaceAll("_", " ")
    var driver = neo4j.driver(
      "bolt://192.168.8.125:7691",
      neo4j.auth.basic("neo4j", "test"),
      {
        maxTransactionRetryTime: 30000,
      }
    );
    var session = driver.session({ database: "neo4j" });
    console.log(`MATCH (n) where n.name="${id}" and n.database="ArupDemo" and n.measurement="OTP" return n.BMS_id as id`);
    result = await session
      .readTransaction((txc) => txc.run(`MATCH (n) where n.name="${id}" and n.database="ArupDemo" and n.measurement="OTP" return n.BMS_id as id`))
      .then((respose) => {
        console.log(respose.records);
        if (respose.records.length > 0) {
          let record = respose.records[0]._fields[0]
          console.log(record);
          if (record === null) {
            res.send({success: true, result: false})
          } else {
            res.send({success: true, result: true})
          }
        } else {
          res.send({success: false, result: false})
        }
      });
  }
})

module.exports = router;
