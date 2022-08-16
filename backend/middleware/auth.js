//requires
const jwt = require("jsonwebtoken");

//export d'une fonction qui sera notre middleware
module.exports = (req, res, next) => {
    try {
        //récuperation du token dans le header authorization et le split pour tout recup apres l'espace dans le header
        const token = req.headers.authorization.split(' ')[1];
        //Decodage du token avec la mthod verify de jwt en lui passant le token recup et la clef secrete
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //Extraction de l'id user de notre token et ajout a la request pour que les routes puissent l'exploiter
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
     next();
    } catch(error) {
        res.status(401).json({ error });
    }
 };