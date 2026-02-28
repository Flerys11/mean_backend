const Commande = require('../models/Commande.model');
const paginationService = require('../services/Pagination.service');
const stockService = require('../services/Stock.service');
const Stock = require('../models/Stock.model');

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

    async findPending(options = {}) {
        return await paginationService.getPaginatedData(
            Commande,
            { __v: 0 },
            options,
            10,
            { createdAt: -1 },
            'articles.article'
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

    async stats(type, options = {}) {
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
                $addFields: {
                    prixLigne: { $multiply: ["$articles.quantite", "$articleData.prix"] }
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

        return await paginationService.getPaginatedAggregation(Commande, pipeline, options, 30);
    }
}

module.exports = new CommandeService();

