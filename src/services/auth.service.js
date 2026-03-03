const Utilisateur = require("../models/utilisateur.model");
const Boutique = require("../models/Boutique.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
    async register(data) {
        const exists = await Utilisateur.findOne({ email: data.email });
        if (exists) throw new Error("Email existe deja");

        let boutique = await Boutique.findOne({ nom: data.nom_boutique });

        if (!boutique) {
            boutique = await Boutique.create({
                nom: data.nom_boutique,
                prix_loyer: data.prix_loyer
            });
        }

        const hashMot_de_passe = await bcrypt.hash(data.mot_de_passe, 10);

        const utilisateur = await Utilisateur.create({
            boutique: boutique._id,
            type_boutique: data.type_boutique,
            email: data.email,
            mot_de_passe: hashMot_de_passe,
            contact: data.contact,
            role: data.role
        });

        return utilisateur;
    }

    async login(email, mot_de_passe) {

        const utilisateur = await Utilisateur
            .findOne({ email })
            .populate("boutique");

        if (!utilisateur)
            throw new Error("email ou mot de passe incorrect");

        if (!utilisateur.boutique || utilisateur.boutique.validate === false) {
            throw new Error("Votre boutique n'est pas encore validée");
        }

        const valid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!valid)
            throw new Error("email ou mot de passe incorrect");

        const token = jwt.sign(
            { id: utilisateur._id, role: utilisateur.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        return { utilisateur, token };
    }

}

module.exports = new AuthService();
