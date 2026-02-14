const Utilisateur = require("../models/utilisateur.model");

class UtilisateurService {
    async findAll() {
        return await Utilisateur.find().select("-mot_de_passe");
    }

    async findById(id) {
        return await Utilisateur.findById(id).select("-mot_de_passe");
    }

    async update(id, data) {
        return await Utilisateur.findByIdAndUpdate(id, data, { new: true }).select("-mot_de_passes");
    }

    async delete(id) {
        return await Utilisateur.findByIdAndDelete(id);
    }
}

module.exports = new UtilisateurService();
