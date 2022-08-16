//Import de express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Import pour acceder au path du serveur
const path = require('path');

//Import dotenv pour connexion bdd
const dotenv = require("dotenv").config();

//importations de routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//Créartion de app qui contien l'application express
const app = express();

//Ajout des headers pour ne pas etre bloquer par CORS qui bloque les appel http de différents serveur.
//Ces header permettent :
app.use((req, res, next) => {
    //d'accéder à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Origin', '*');
    //d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Connexion a la base de donnée mongo DB via dotenv
mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


  app.use(express.json());
  app.use(bodyParser.json());

//routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

  module.exports = app;