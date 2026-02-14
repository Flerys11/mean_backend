const Categorie = require("../models/Categorie.model");

class CategorieService {
    async create(data) {
        return await Categorie.create(data);
    }

    async findAll() {
        return await Categorie.find();
    }

    async findById(id) {
        return await Categorie.findById(id);
    }

    async update(id, data) {
        return await Categorie.findByIdAndUpdate(id,data, { new: true});
    }

    async delete(id) {
        return await Categorie.findByIdAndDelete(id);
    }
}

module.exports = new CategorieService();