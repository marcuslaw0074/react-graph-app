var express = require("express");
var neo4j = require("neo4j-driver");
var router = express.Router();


function getProperties(ls) {
  return (
    [ls[0].properties.name, ls[1].type, ls[2].properties.name]
  )
}
// 192.168.100.214:27687
var driver = neo4j.driver(
  "bolt://192.168.8.125:7691",
  neo4j.auth.basic("neo4j", "test"),
  {
    maxTransactionRetryTime: 30000,
  }
);

router.post("/", async function (req, res, next) {
  console.log(req.body);
  var session = driver.session({ database: "neo4j" });
  var ls = [];
  const txc = session.beginTransaction();
  console.log(req.body.statements);
  try {
    for (const query of req.body.statements) {
      var ress = await txc.run(query.statement || "RETURN 0");
      ls.push(ress.records.map(ele => ele._fields).map(ele => getProperties(ele)))
      console.log(ress);
    }

    await txc.commit();
  } catch (e) {
    await txc.rollback();
    return Promise.reject(e);
  } finally {

    await session.close();

    res.send(ls.flat())

  }

});

module.exports = router;