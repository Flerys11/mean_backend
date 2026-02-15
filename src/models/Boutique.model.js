const mongoose = require("mongoose");

const boutiqueSchema = new mongoose.Schema({
    nom: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Boutique", boutiqueSchema);
