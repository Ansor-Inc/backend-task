const express = require("express");
const app = express();
const routes = require("./routes");
const helmet = require("helmet");
const { PORT } = require("./config/keys");
const path = require("path");

app.use(express.json());
app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "image")));

app.use(routes);

module.exports = { PORT, app };
