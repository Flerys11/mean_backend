const Commande = require('../models/Commande.model');
const paginationService = require('../services/Pagination.service');
const stockService = require('../services/Stock.service');
const Stock = require('../models/Stock.model');
const Article = require('../models/Article.model');
const mongoose = require('mongoose');

class CommandeService {
    #getDateFormat(type) {
        const formats = {
            jour: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            mois: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            annee: { $dateToString: { format: "%Y", date: "$createdAt" } }
        };

        if (!formats[type]) throw new Error(`Type invalide: ${type}`);
        return formats[type];
    }

    async findAll(options = {}) {
        return await paginationService.getPaginatedData(
            Commande,
            {},
            options,
            10,
            { createdAt: -1 },
            'articles.article'
        );
    }

    async findPending(id_boutique, options = {}) {

        const filter = {__v : 0};

        if (id_boutique) {
            const articlesIds = await Article
                .find({ id_boutique })
                .distinct("_id");

            filter["articles.article"] = { $in: articlesIds };
        }

        return await paginationService.getPaginatedData(
            Commande,
            filter,
            options,
            10,
            { createdAt: -1 },
            "articles.article"
        );
    }

    async updateVersionToOne(id) {
        return await Commande.findByIdAndUpdate(id, { __v: 1 }, { returnDocument: 'after' });
    }

    async cancelCommande(id) {
        const commande = await Commande.findById(id);
        if (!commande) return null;

        if (commande.__v === 2) {
            throw new Error('Commande déjà annulée');
        }

        const stockMovements = (commande.articles || []).map(item => ({
            id_article: item.article,
            quantite_entree: item.quantite,
            quantite_sortie: 0
        }));

        if (stockMovements.length > 0) {
            await Stock.insertMany(stockMovements);
        }

        return await Commande.findByIdAndUpdate(id, { __v: 2 }, { returnDocument: 'after' });
    }

    async create(data) {
        for (const item of data.articles) {
            const stockData = await stockService.getStockByArticle(item.article);
            const stockRestant = stockData[0]?.stock_restant || 0;

            if (stockRestant < item.quantite) {
                throw new Error(`Stock insuffisant pour article ${item.article}`);
            }
        }

        const stockMovements = data.articles.map(item => ({
            id_article: item.article,
            quantite_entree: 0,
            quantite_sortie: item.quantite
        }));

        await Stock.insertMany(stockMovements);
        return await Commande.create(data);
    }

    async stats(type, id_boutique, options = {}) {

        const format = this.#getDateFormat(type);

        const pipeline = [

            { $unwind: "$articles" },

            {
                $lookup: {
                    from: "articles",
                    localField: "articles.article",
                    foreignField: "_id",
                    as: "articleData"
                }
            },

            { $unwind: "$articleData" },

            {
                $match: {
                    ...(id_boutique && {
                        "articleData.id_boutique": new mongoose.Types.ObjectId(id_boutique)
                    })
                }
            },

            {
                $addFields: {
                    prixLigne: {
                        $multiply: ["$articles.quantite", "$articleData.prix"]
                    }
                }
            },

            {
                $group: {
                    _id: format,
                    totalCommandes: { $addToSet: "$_id" },
                    chiffreAffaire: { $sum: "$prixLigne" }
                }
            },

            {
                $project: {
                    totalCommandes: { $size: "$totalCommandes" },
                    chiffreAffaire: 1
                }
            },

            { $sort: { _id: 1 } }
        ];

        return await paginationService.getPaginatedAggregation(
            Commande,
            pipeline,
            options,
            30
        );
    }

    async statsByArticle(type, id_article) {

        let format;

        switch (type) {
            case "jour":
                format = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;

            case "mois":
                format = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                break;

            case "annee":
                format = { $dateToString: { format: "%Y", date: "$createdAt" } };
                break;

            default:
                throw new Error("Type invalide");
        }

        return await Commande.aggregate([

            { $unwind: "$articles" },

            {
                $match: {
                    "articles.article": new mongoose.Types.ObjectId(id_article)
                }
            },

            {
                $lookup: {
                    from: "articles",
                    localField: "articles.article",
                    foreignField: "_id",
                    as: "articleData"
                }
            },

            { $unwind: "$articleData" },

            {
                $addFields: {
                    prixLigne: {
                        $multiply: ["$articles.quantite", "$articleData.prix"]
                    }
                }
            },

            {
                $group: {
                    _id: {
                        date: format,
                        article: "$articles.article"
                    },
                    totalQuantite: { $sum: "$articles.quantite" },
                    totalCommandes: { $addToSet: "$_id" },
                    chiffreAffaire: { $sum: "$prixLigne" }
                }
            },

            {
                $project: {
                    date: "$_id.date",
                    article: "$_id.article",
                    totalQuantite: 1,
                    totalCommandes: { $size: "$totalCommandes" },
                    chiffreAffaire: 1,
                    _id: 0
                }
            },

            { $sort: { date: 1 } }
        ]);
    }
}

module.exports = new CommandeService();

