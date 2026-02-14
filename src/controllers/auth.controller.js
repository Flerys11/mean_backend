const authService = require("../services/auth.service");

class AuthController {
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, mot_de_passe } = req.body;
            const result = await authService.login(email, mot_de_passe);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();
