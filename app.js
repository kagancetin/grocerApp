const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helpers = require("handlebars-helpers")();
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

const handlebarsHelpers = require("./helpers/handlebarsHelpers");

const allHelpers = { ...helpers, ...handlebarsHelpers };

var app = express();

var index = require("./router/index");
var transactions = require("./router/transactions");

// MongoDB Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/grocerApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB Connection Error"));
db.once("open", () => {
  console.log("DB Connected");
});

//Session
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false,
  })
);
// Bodyparser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Connect Flash
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

// Template Engine
const hbs = exphbs.create({
  extname: "handlebars",
  defaultLayout: "main",
  helpers: allHelpers,
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.flashMessages = {
    error: req.flash("error"),
    success: req.flash("success"),
    warning: req.flash("warning"),
  };
  next();
});

app.use("/", index);
app.use("/transactions", transactions);

const server = app.listen(3000, () =>
  console.log(`Express server listening on port 3000`)
);

module.exports = app;
