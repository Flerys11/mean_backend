const commandeService = require('../services/Commande.service');

class CommandeController {
    async create(req, res, next) {
        try {
            const commande = await commandeService.create(req.body);
            res.status(201).json(commande)
        } catch (e) {
            next(e);
        }
    }

    async getStats(req, res) {
        try {
            const { type } = req.params;

            const result = await commandeService.stats(type);

            res.status(200).json({
                success: true,
                type,
                data: result
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CommandeController();