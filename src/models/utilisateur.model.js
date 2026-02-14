const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema(
    {
            boutique: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Boutique",
                    required: true
            },
        type_boutique:{type: Number, required: true},
        email: { type: String, required: true, unique: true },
        mot_de_passe: { type: String, required: true },
        role: { type: String, default: "USER" },
        contact: {type: String, required: true, match: [/^\d{10}$/, "Le contact doit contenir exactement 10 chiffres"]},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
