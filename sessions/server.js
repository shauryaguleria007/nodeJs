const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const connection = mongoose.connect(
  "mongodb+srv://shauryaguleria:pkwuOuSXHjVqGI9X@sessioncluster.mhtb1dl.mongodb.net/userData?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const router = express.Router();
const user = { id: 1 };

server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(
  session({
    secret: "keyboard",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: "sessionStore",
      touchAfter: 1000 * 60 * 60 * 24,
      autoRemove: "interval",
      autoRemoveInterval:1
    }),
    cookie: { maxAge: 1000*60, secure: false },
  })
);

const CheckSession = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

router.get("", (req, res) => {
  res.redirect("/home");
});
router.route("/login", CheckSession).get((req, res) => {
  req.session.user = user;
  res.send("login");
});
router.get("/home", CheckSession, (req, res) => {
  res.send(`user id ${req.session.user.id}`);
});
router.route("/logout", CheckSession).get((req, res) => {
  res.send("logout");
});

server.use("/", router);
server.listen(3000, (error) => {
  if (error || !connection) console.log("error");
  else console.log("server started at port 3000");
});
