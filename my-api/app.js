var createError = require("http-errors");
var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { schema, root} = require("./routes/graphql")
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var logger = require("morgan");
var bodyParser = require('body-parser');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var queryRouter = require("./routes/query");
var multiqueryRouter = require("./routes/multiquery");
var influxdbRouter = require("./routes/influxdb")
var influxdbclientRouter = require("./routes/influxclient")
var redisRouter = require("./routes/redis")

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON


var app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/query", queryRouter);
app.use("/multiquery", multiqueryRouter);
app.use("/influxdb", influxdbRouter);
app.use("/influxdbclientRouter", influxdbclientRouter);
app.use('/redis', redisRouter);


app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
