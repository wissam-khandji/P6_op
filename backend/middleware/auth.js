//requires
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

//export d'une fonction qui sera notre middleware
module.exports = (req, res, next) => {
    try {
        //récuperation du token dans le header authorization et le split pour tout recup apres l'espace dans le header
        const token = req.headers.authorization.split(' ')[1];
        //Decodage du token avec la mthod verify de jwt en lui passant le token recup et la clef secrete
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        //Extraction de l'id user de notre token et ajout a la request pour que les routes puissent l'exploiter
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
          } else {
            next();
          }
    } catch(error) {
        res.status(401).json({ error });
    }
 };