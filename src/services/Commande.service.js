const Commande = require('../models/Commande.model');
const stockService = require('../services/Stock.service');
const Stock = require('../models/Stock.model');

class CommandeService {

    async create(data) {

        try {

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

            const commande = await Commande.create(data);

            return commande;

        } catch (error) {
            throw error;
        }
    }


    async stats(type) {

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
        ]);
    }
}

module.exports = new CommandeService();