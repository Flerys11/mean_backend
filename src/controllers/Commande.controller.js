const commandeService = require('../services/Commande.service');

class CommandeController {

    async findAll(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await commandeService.findAll({ page, limit });
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async findPending(req, res, next) {
        try {
            const { page, limit } = req.query;
            const id_boutique = req.params.id;
            const result = await commandeService.findPending(id_boutique,{ page, limit });
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateVersionToOne(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await commandeService.updateVersionToOne(id);
            if (!updated) return res.status(404).json({ message: 'Commande introuvable' });
            res.status(200).json(updated);
        } catch (e) {
            next(e);
        }
    }

    async cancel(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await commandeService.cancelCommande(id);
            if (!updated) return res.status(404).json({ message: 'Commande introuvable' });
            res.status(200).json(updated);
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const commande = await commandeService.create(req.body);
            res.status(201).json(commande)
        } catch (e) {
            next(e);
        }
    }

    async getStats(req, res, next) {
        try {

            const { type } = req.params;
            const { page, limit, id_boutique } = req.query;

            const result = await commandeService.stats(
                type,
                id_boutique,
                { page, limit }
            );

            res.status(200).json({
                success: true,
                type,
                ...result
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStatsByArticle(req, res) {
        try {
            const { type, id } = req.params;

            const result = await commandeService.statsByArticle(type, id);

            res.status(200).json({
                success: true,
                type,
                id,
                result
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