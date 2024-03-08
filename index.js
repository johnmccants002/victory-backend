var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const OpenAI = require("openai");
const authRouter = require("./routes/auth"); // The file name of your routes
const profileRouter = require("./routes/profiles");
const aiVictoriesRouter = require("./routes/aiVictories");
const followRouter = require("./routes/follow");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const victoriesRouter = require("./routes/victories");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporarily store files in an 'uploads' directory
require("dotenv").config(); // For loading environment variables
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors()); // This will enable CORS for all routes

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/victories", victoriesRouter);
app.use("/api/ai-victories", aiVictoriesRouter);
app.use("/api/follow", followRouter);

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
