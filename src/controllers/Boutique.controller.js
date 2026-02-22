const BoutiqueService = require("../services/Boutique.service");

class BoutiqueController {
    async create(req, res, next) {
        try {
            const Boutique = await BoutiqueService.create(req.body);
            res.status(201).json(Boutique)

        }catch (e) {
            next(e);
        }
    }

    async findAll(req, res, next) {
        try {
            const Boutiques = await BoutiqueService.findAll();
            res.status(201).json(Boutiques)

        }catch (e){
            next(e);
        }
    }

    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const Boutique = await BoutiqueService.findById(id)
            if (!Boutique) return res.status(404).json({message: 'Boutique n \'  existe pas '});
            res.status(201).json(Boutique)

        }catch (e){
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const Boutique = await BoutiqueService.update(id, req.body);
            res.status(201).json(Boutique)

        }catch (e){
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const Boutique = await BoutiqueService.delete(id)
            if (!Boutique) return res.status(404).json({message: 'Boutique n \' existe pas '});
            res.json("Boutique supprimer");
        } catch (e){
            next(e);
        }
    }
}

module.exports = new BoutiqueController();