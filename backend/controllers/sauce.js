//requires
const Sauce = require("../models/Sauce");
const fs = require("fs");

//récupération des sauces
exports.getAllSauces = (req, res, next) => {
    //Utilisation de find afin de renvoyer in tableau qui contien toutes les sauces
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//récupération d'une sauce en fonction de son id
exports.getOneSauce = (req, res, next) => {
    //Utilisation de findOne dans le model Sauce pour trouver l'article unique ayant le meme id que le param de la requete.
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};



//création d'une sauce
exports.createSauce = (req, res, next) => {
    //Récuperation du contenu de sauce
    const addSauce = JSON.parse(req.body.sauce)
    //Supression de id car mongodb en creer automatiquement
    delete addSauce._id;
    //Création de lobjet avec ce qui a été passer précedemment.
    const sauce  = new Sauce({
        ...addSauce,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    //Enregistrement dans la database via method save
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créee" }))
    .catch((error) => res.status(400).json({ error }));
};

//mise à jour d'une sauce
exports.updateSauce = (req, res, next) => {
    //Verification si il ya un champ file dans la requete
    const sauceObject = req.file ?
    //si la requête contient une nouvelle image
    {
        ...JSON.parse(req.body.sauce),
        //Et on recupere l'url de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        //si la requête ne contient pas de nouvelle image, on recupere l'objet direct dans le corps de la requete
    } : { ...req.body };
    //Mise a jour de l'enregistrement via updateOne avec l'ojet recup puis le nouveau
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée"}))
    .catch(error => res.status(400).json({ error }));
    
};

//suppression d'une sauce en fonction de son id et de l'image correspondante en récupérant le nom de l'image
exports.deleteSauce = (req, res, next) => {
    //On recupere l'article en BDD
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split("/images/")[1];
        //supression de l'image du dossier
        fs.unlink(`images/${filename}`, () => {
            //suppression de la sauce de la bdd
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée" }))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.like = (req, res, next) => {
    //si la requête est un like
    if (req.body.like === 1) {
        //ajout du like à la sauce et de l'utilisateur dans l'array usersLiked
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    //si la requête est un dislike        
    } else if (req.body.like === -1) {
        //ajout du dislike à la sauce et de l'utilisateur dans l'array usersDisliked
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } else {
        //si la requête est une annulation
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                //si c'est une annulation d'un like et que l'utilisateur fait parti de l'array usersLiked
                if (sauce.usersLiked.includes(req.body.userId)) {
                    //suppression du like et de l'utilisateur de l'array usersLiked
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                //si c'est une annulation d'un dislike et que l'utilisateur fait parti de l'array usersDisliked
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    //suppression du dislike et de l'utilisateur de l'array usersDisliked
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};