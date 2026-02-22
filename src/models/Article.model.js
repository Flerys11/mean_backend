const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
    nom_article: {
        type: String, 
        required: true
    },
    prix: {
        type: Number, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    photo:{
        type: [String],
        required: false
    },
    id_categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie", 
      required: true
    },
    id_boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique", 
      required: true
    }
},
    {
        timestamps: true
    });
      
module.exports = mongoose.model('Article', articleSchema); 