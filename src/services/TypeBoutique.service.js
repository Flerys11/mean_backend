const TypeBoutique = require("../models/TypeBoutique.model");

class TypeBoutiqueService {
    async create(data) {
        return await TypeBoutique.create(data);
    }

    async findAll() {
        return await TypeBoutique.find();
    }

    async findById(id) {
        return await TypeBoutique.findById(id);
    }

    async update(id, data) {
        return await TypeBoutique.findByIdAndUpdate(id,data, { new: true});
    }

    async delete(id) {
        return await TypeBoutique.findByIdAndDelete(id);
    }
}

module.exports = new TypeBoutiqueService();