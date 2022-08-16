//requires
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Import de JSON web token
const jwt = require('jsonwebtoken');

//--------- Création d'un User -----------
exports.signup = (req, res, next) => {
    //appel du hachage de bcrypt et de le "saler" 10 fois pour une meilleur sécurité
    bcrypt.hash(req.body.password, 10)
    //Création de l'user dans le bloc then
    .then(hash => {
      //instance du model User
      const user = new User({
        email: req.body.email,
        password: hash
      });
      //Save dans la BDD
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//---------- Connexion User -----
exports.login = (req, res, next) => {
    //Utilisation findOne pouyr l'email et la valeur transmise par le client
    User.findOne({ email: req.body.email })
        .then(user => {
          //Verification si le user est null avec message flou pour ne pas laiser d'indice
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
              //si user est enregistrer on compare le PW de la BDD avec celui utilisé via compare de bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  //Si la valeur n'est pas valide on envoi une erreur avec le meme massage
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                      //Si le PW est correct on retourne un code 200 avec obj qui contient le USER id avec un TOKEN
                      res.status(200).json({
                          userId: user._id,
                          /*Appel de la fonction Sign de jwt pour chiffrer un token contenant un obj avec le user id 
                          et la clef secrete de l'encodage avec expiration du token sous 24h*/
                          token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                          )
                      });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
  };