const Stock = require("../models/Stock.model");
const paginationService = require("./Pagination.service");
const mongoose = require('mongoose');
const Article = require("../models/Article.model");

class StockService {

    #getAggregationPipeline() {
        return [
            {
                $group: {
                    _id: "$id_article",
                    total_entree: {$sum: "$quantite_entree"},
                    total_sortie: {$sum: "$quantite_sortie"}
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
                    article_description: "$article.description",
                    article_photo: "$article.photo",
                    stock_restant: {
                        $subtract: ["$total_entree", "$total_sortie"]
                    }
                }
            }
        ];
    }

    #getAggregationPipelineBoutique(idBoutique) {
        return [
            {
                $match: {
                    id_boutique: new mongoose.Types.ObjectId(idBoutique)
                }
            },
            {
                $lookup: {
                    from: "stocks",
                    localField: "_id",
                    foreignField: "id_article",
                    as: "stocks"
                }
            },
            {
                $addFields: {
                    total_entree: {
                        $sum: "$stocks.quantite_entree"
                    },
                    total_sortie: {
                        $sum: "$stocks.quantite_sortie"
                    }
                }
            },
            {
                $project: {
                    nom_article: 1,
                    prix: 1,
                    description: 1,
                    photo: 1,
                    id_categorie: 1,
                    stock_restant: {
                        $ifNull: [
                            { $subtract: ["$total_entree", "$total_sortie"] },
                            0
                        ]
                    }
                }
            }
        ];
    }

    async create(data) {
        return await Stock.create(data);
    }

    async getStockGlobal(options = {}) {
        const pipeline = this.#getAggregationPipeline();
        return await paginationService.getPaginatedAggregation(Stock, pipeline, options, 10);
    }


    async getStockByBoutique(idBoutique, options = {}) {
        const pipeline = this.#getAggregationPipelineBoutique(idBoutique);

        return await paginationService.getPaginatedAggregation(
            Article,
            pipeline,
            options,
            10
        );
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

