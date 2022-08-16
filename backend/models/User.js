//require
const mongoose = require('mongoose');
//import de unique validator pour que 2 user n'ai pas le meme email
const uniqueValidator = require('mongoose-unique-validator');

//schéma utilisateur, on ne passe pas l'id car Mongo le fait automatiquement.
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
});

//vérification que l'utilisateur est unique
userSchema.plugin(uniqueValidator);

//exportation du schéma user
module.exports = mongoose.model("User", userSchema);
