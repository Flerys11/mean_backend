const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
    nom_client: {
        type: String,
        required: true
    },
    contact_client: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Le contact doit contenir exactement 10 chiffres"]
    },
    adresse_client: {
        type: String,
        required: true
    },

    articles: [
        {
            article: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Article",
                required: true
            },
            quantite: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('Commande', commandeSchema);
