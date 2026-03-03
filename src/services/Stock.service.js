const Stock = require("../models/Stock.model");
const paginationService = require("./Pagination.service");
const mongoose = require('mongoose');

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

    #getAggregationPipelineBoutique(idBoutique = null) {
        const pipeline = [
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
            {$unwind: "$article"}
        ];

        if (idBoutique) {
            pipeline.push({
                $match: {
                    "article.id_boutique": new mongoose.Types.ObjectId(idBoutique)
                }
            });
        }

        pipeline.push({
            $project: {
                nom_article: "$article.nom_article",
                prix: "$article.prix",
                description: "$article.description",
                photo: "$article.photo",
                id_categorie: "$article.id_categorie",
                stock_restant: {
                    $subtract: ["$total_entree", "$total_sortie"]
                }
            }
        });

        return pipeline;
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
        return await paginationService.getPaginatedAggregation(Stock, pipeline, options, 10);
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

