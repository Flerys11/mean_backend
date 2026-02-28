const BoutiqueService = require("../services/Boutique.service");

class BoutiqueController {
    async create(req, res, next) {
        try {
            const boutique = await BoutiqueService.create(req.body);
            res.status(201).json(boutique);
        } catch (e) {
            next(e);
        }
    }

    async findAll(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await BoutiqueService.findAll({ page, limit });
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const boutique = await BoutiqueService.findById(id);
            if (!boutique) return res.status(404).json({ message: 'Boutique n\'existe pas' });
            res.status(200).json(boutique);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const boutique = await BoutiqueService.update(id, req.body);
            res.status(200).json(boutique);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const boutique = await BoutiqueService.delete(id);
            if (!boutique) return res.status(404).json({ message: 'Boutique n\'existe pas' });
            res.status(200).json({ message: 'Boutique supprimée' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BoutiqueController();