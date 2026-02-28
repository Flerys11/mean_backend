const stockService = require('../services/Stock.service');

class StockController {
    async create(req, res, next) {
        try {
            const stock = await stockService.create(req.body);
            res.status(201).json(stock);
        } catch (e) {
            next(e);
        }
    }

    async getStock(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await stockService.getStockGlobal({ page, limit });
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new StockController();

