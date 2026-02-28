const mongoose = require("mongoose");

const boutiqueSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    validate: { type: Boolean, required: true,default: false },
    prix_loyer: {type: Number, required: true}
}, { timestamps: true });

module.exports = mongoose.model("Boutique", boutiqueSchema);
