var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let alimentsRouter = require("./routes/aliments");
let platRouter = require("./routes/plats");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/aliments", alimentsRouter);
app.use("/", indexRouter);
app.use("/plats", platRouter);

module.exports = app;
