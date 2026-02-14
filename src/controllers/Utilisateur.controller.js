const utilisateurService = require("../services/Utilisateur.service");

class UserController {
    async findAll(req, res, next) {
        try {
            res.json(await utilisateurService.findAll());
        } catch (e) {
            next(e);
        }
    }

    async findOne(req, res, next) {
        try {
            res.json(await utilisateurService.findById(req.params.id));
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            res.json(await utilisateurService.update(req.params.id, req.body));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            await userService.delete(req.params.id);
            res.json({ message: "Supprimer" });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
