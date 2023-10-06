var express = require("express");
var router = express.Router();
var Influx = require("influx");

const influx = new Influx.InfluxDB({
  host: "192.168.100.214", // 192.168.100.214
  database: "Swire_FDD",
  schema: [
    {
      measurement: "Utility_3",
      fields: { value: Influx.FieldType.FLOAT },
      tags: ["EquipmentName", "FunctionType", "Level", "id", "prefername"],
    },
    {
      measurement: 'Utility_3_3',
      fields: { recommend_action: Influx.FieldType.STRING, cost_saving: Influx.FieldType.FLOAT,
        threshold: Influx.FieldType.STRING, start_time_dt: Influx.FieldType.FLOAT, 
        end_time_dt: Influx.FieldType.FLOAT},
      tags: ['start_time', 'start_time', 'Level', 'id', 'prefername']
  }
  ],
});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  const query = req.body.query;
  const result = await influx.query(query);

  res.send(result);
});

module.exports = router;
