const ArticleService = require("../services/Article.service");

class ArticleController {

    async findByBoutique(req, res, next) {
        try {
            const { page, limit } = req.query;
            const id_boutique = req.params.id_boutique;

            const result = await ArticleService.findByBoutique(
                id_boutique,
                { page, limit }
            );

            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const article = await ArticleService.create(req.body);
            res.status(201).json(article)

        }catch (e) {
            next(e);
        }
    }

    async findAll(req, res, next) {
        try {
            const articles = await ArticleService.findAll();
            res.status(201).json(articles)

        }catch (e){
            next(e);
        }
    }

    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const article = await ArticleService.findById(id)
            if (!article) return res.status(404).json({message: 'Article n \'  existe pas '});
            res.status(201).json(article)

        }catch (e){
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const id = req.params.id;
            const article = await ArticleService.update(id, req.body);
            res.status(201).json(article)

        }catch (e){
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const article = await ArticleService.delete(id)
            if (!article) return res.status(404).json({message: 'Article n \' existe pas '});
            res.json("Article supprimer");
        } catch (e){
            next(e);
        }
    }
}

module.exports = new ArticleController();