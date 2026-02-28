const Article = require('../models/Article.model');
const paginationService = require('./Pagination.service');

class ArticleService {
    async create(data) {
        return await Article.create(data);
    }

    async findAll(options = {}) {
        return await paginationService.getPaginatedData(
            Article,
            {},
            options,
            10,
            { createdAt: -1 }
        );
    }

    async findById(id) {
        return await Article.findById(id);
    }

    async update(id, data) {
        return await Article.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    }

    async delete(id) {
        return await Article.findByIdAndDelete(id);
    }
}

module.exports = new ArticleService();

