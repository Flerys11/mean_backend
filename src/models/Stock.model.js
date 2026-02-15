const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    id_article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    quantite_entree: {
        type: Number, required: true, default: 0
    },
    quantite_sortie: {
        type: Number, required: true, default: 0
    },

},
    {timestamps: true});

module.exports = mongoose.model('Stock', stockSchema);