require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.route"));
app.use("/utilisateur", require("./routes/utilisateur.route"));

app.use(require("./middlewares/erreur.middlewares"));

module.exports = app;

