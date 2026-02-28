class PaginationService {
    parsePaginationOptions(options = {}, defaultLimit = 10) {
        const page = Math.max(parseInt(options.page) || 1, 1);
        const limit = Math.max(parseInt(options.limit) || defaultLimit, 1);
        const skip = (page - 1) * limit;
        return { page, limit, skip };
    }

    getPaginatedResponse(data, page, limit, total) {
        const totalPages = Math.ceil(total / limit) || 1;
        return { data, page, limit, total, totalPages };
    }

    async getPaginatedData(model, filter = {}, options = {}, defaultLimit = 10, sort = { createdAt: -1 }, populate = null) {
        const { page, limit, skip } = this.parsePaginationOptions(options, defaultLimit);

        let query = model.find(filter).sort(sort).skip(skip).limit(limit);

        if (populate) {
            query = query.populate(populate);
        }

        const [total, data] = await Promise.all([
            model.countDocuments(filter),
            query.exec()
        ]);

        return this.getPaginatedResponse(data, page, limit, total);
    }

    async getPaginatedAggregation(model, pipeline, options = {}, defaultLimit = 10) {
        const { page, limit, skip } = this.parsePaginationOptions(options, defaultLimit);

        const [countResult, data] = await Promise.all([
            model.aggregate([...pipeline, { $count: "total" }]),
            model.aggregate([...pipeline, { $skip: skip }, { $limit: limit }])
        ]);

        const total = countResult[0]?.total || 0;
        return this.getPaginatedResponse(data, page, limit, total);
    }
}

module.exports = new PaginationService();

