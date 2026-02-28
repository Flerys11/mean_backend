const Boutique = require("../models/Boutique.model");
const paginationService = require("./Pagination.service");

class BoutiqueService {
    async create(data) {
        return await Boutique.create(data);
    }

    async findAll(options = {}) {
        return await paginationService.getPaginatedData(
            Boutique,
            {},
            options,
            10,
            { createdAt: -1 }
        );
    }

    async findById(id) {
        return await Boutique.findById(id);
    }

    async update(id, data) {
        return await Boutique.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    }

    async delete(id) {
        return await Boutique.findByIdAndDelete(id);
    }
}

module.exports = new BoutiqueService();