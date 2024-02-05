const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3025;
const connectDB = require("./config/mongoose");
const errorHandler = require("./middleware/error");

require("dotenv").config({ path: "./.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();

// --------------------------------------------(end of init)------------------------------------------
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

// ----------------------------------------(sessions and cookies🍪)----------------------------------
app.use(
  session({
    secret: process.env.ENCRYPT_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get("/", (req, res) => {
  res.json({ app: "running" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
app.use("/api/Speeds", require("./routes/Speeds"));
app.use("/api/ExternalPing", require("./routes/ExternalPing"));
app.use("/api/ExternalPingData", require("./routes/ExternalPingData"));
app.use("/api/InternalPing", require("./routes/InternalPing"));
app.use("/api/InternalPingData", require("./routes/InternalPingData"));
app.use("/api/ExternalPingData", require("./routes/ExternalPingData"));
app.use("/api/Packages", require("./routes/Packages"));
app.use("/api/Packages", require("./routes/Packages"));
app.use("/api/Groups", require("./routes/Groups"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("✅ Listening on port " + PORT);
});

