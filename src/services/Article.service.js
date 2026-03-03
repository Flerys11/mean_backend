const Article = require('../models/Article.model');
const paginationService = require('./Pagination.service');

class ArticleService {

    async findByBoutique(id_boutique, options = {}) {
        return await paginationService.getPaginatedData(
            Article,
            { id_boutique: id_boutique },
            options,
            5,
            { createdAt: -1 }
        );
    }

    async create(data) {
        if (data.photo && Array.isArray(data.photo)) {
            data.photo = data.photo.filter(photo => photo && photo.length > 0);
        }
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
        if (data.photo && Array.isArray(data.photo)) {
            data.photo = data.photo.filter(photo => photo && photo.length > 0);
        }
        return await Article.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    }

    async delete(id) {
        return await Article.findByIdAndDelete(id);
    }
}

module.exports = new ArticleService();