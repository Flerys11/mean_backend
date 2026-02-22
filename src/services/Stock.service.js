const Stock = require("../models/Stock.model");
const mongoose = require('mongoose');

class StockService {
    async create(data) {
        return await Stock.create(data);
    }

    async getStockGlobal() {
        return await Stock.aggregate([
            {
                $group: {
                    _id: "$id_article",
                    total_entree: { $sum: "$quantite_entree" },
                    total_sortie: { $sum: "$quantite_sortie" }
                }
            },
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "_id",
                    as: "article"
                }
            },
            {
                $unwind: "$article"
            },
            {
                $project: {
                    article_nom: "$article.nom_article",
                    article_prix: "$article.prix",
                    stock_restant: {
                        $subtract: ["$total_entree", "$total_sortie"]
                    }
                }
            }
        ]);
    }

    async getStockByArticle(articleId) {
        return await Stock.aggregate([
            {
                $match: {
                    id_article: new mongoose.Types.ObjectId(articleId)
                }
            },
            {
                $group: {
                    _id: "$id_article",
                    total_entree: { $sum: "$quantite_entree" },
                    total_sortie: { $sum: "$quantite_sortie" }
                }
            },
            {
                $project: {
                    stock_restant: {
                        $subtract: ["$total_entree", "$total_sortie"]
                    }
                }
            }
        ]);
    }


}

module.exports = new StockService();