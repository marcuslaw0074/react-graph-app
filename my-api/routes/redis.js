var express = require("express");
var router = express.Router();
var redis = require("redis");

const client = redis.createClient({url: 'redis://192.168.100.216:36380'});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  var time = Math.round((new Date()). getTime() / 1000);
  await client.connect();
  await client.hSet('graph', time, JSON.stringify(req.body));
  const result = await client.get('time');
  if (result === null) {
    await client.set("time", JSON.stringify([time]))
  } else {
    var timeList = JSON.parse(result)
    timeList.push(time)
    await client.set("time", JSON.stringify(timeList))
  }
  res.send({result: "success"});
  await client.quit();
}).post("/graph", async function (req, res, next) {
  const reqq = req.body;
  await client.connect();
  var timeList = await client.get("time");
  timeList = JSON.parse(timeList);
  if (Number.isInteger(reqq)) {
    if (reqq > timeList.length -1) {
      var timee = timeList[timeList.length-1]
    } else {
      var timee = timeList[reqq]
    };
  } else {
    var timee = timeList[timeList.length-1]
  };
  const result = await client.hGet("graph", String(timee))
  res.send(JSON.parse(result));
  await client.quit();
})

module.exports = router;