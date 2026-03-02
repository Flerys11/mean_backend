require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.route"));
app.use("/utilisateur", require("./routes/utilisateur.route"));
app.use("/categorie", require("./routes/Categorie.route"));
app.use("/type_boutique", require("./routes/TypeBoutique.route"));
app.use("/boutique", require("./routes/Boutique.route"));
app.use("/commande", require("./routes/Commande.route"));
app.use("/stock", require("./routes/Stock.route"));
app.use("/article", require("./routes/Article.route"));

app.use(require("./middlewares/erreur.middlewares"));

module.exports = app;

