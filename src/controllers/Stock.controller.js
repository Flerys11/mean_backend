const stockService = require('../services/Stock.service');

class StockController {

    async create(req, res, next) {
        try {
            const stock = await stockService.create(req.body);
            res.status(200).send(stock);
        }catch (e){
            next(e);
        }
    }

    async getStock(req, res, next) {
        try {
            const data = await stockService.getStockGlobal();
            res.status(200).send(data);
        }catch (e){
            next(e);
        }
    }
}

module.exports = new StockController();