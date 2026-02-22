const Boutique = require("../models/Boutique.model");

class BoutiqueService {
    async create(data) {
        return await Boutique.create(data);
    }

    async findAll() {
        return await Boutique.find();
    }

    async findById(id) {
        return await Boutique.findById(id);
    }

    async update(id, data) {
        return await Boutique.findByIdAndUpdate(id,data, { new: true});
    }

    async delete(id) {
        return await Boutique.findByIdAndDelete(id);
    }
}

module.exports = new BoutiqueService();