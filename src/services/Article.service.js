const Article = require('../models/Article.model');

class ArticleService {
    async create(data) {
        return await Article.create(data);
    }

    async findAll() {
        return await Article.find();
    }

    async findById(id) {
        return await Article.findById(id);
    }

    async update(id, data) {
        return await Article.findByIdAndUpdate(id,data, { new: true});
    }

    async delete(id) {
        return await Article.findByIdAndDelete(id);
    }
}

module.exports = new ArticleService();