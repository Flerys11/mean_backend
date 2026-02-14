const mongoose = require("mongoose");

const categorieShema = new mongoose.Schema(
    {
        nom : { type: String , required: true },
        valeur : { type: Number , required: true },
    },
    { timestamps: true }


);

module.exports = mongoose.model('Categories', categorieShema);