const categorieService = require("../services/Categorie.service");

class CategorieController {
    async create(req, res, next) {
        try {
            const categorie = await categorieService.create(req.body);
            res.status(201).json(categorie)

        }catch (e) {
            next(e);
        }
    }

    async findAll(req, res, next) {
        try {
            const categories = await categorieService.findAll();
            res.status(201).json(categories)

        }catch (e){
            next(e);
        }
    }

    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const categorie = await categorieService.findById(id)
            if (!categorie) return res.status(404).json({message: 'Categoria n \'  existe pas '});
            res.status(201).json(categorie)

        }catch (e){
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const categorie = await categorieService.update(id, req.body);
            res.status(201).json(categorie)

        }catch (e){
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const categorie = await categorieService.delete(id)
            if (!categorie) return res.status(404).json({message: 'Categoria n \' existe pas '});
            res.json("Categorie supprimer");
        } catch (e){
            next(e);
        }
    }
}

module.exports = new CategorieController();