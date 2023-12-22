const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3002;
const connectDB = require("./config/mongoose");
require("dotenv").config({ path: "./.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();
app.get("/", (req, res) => {
  res.json({ app: "running" });
});
app.listen(PORT, () => {
  console.log("✅ Listening on port " + PORT);
});
app.use("/api/Speeds", require("./routes/Speeds"));
