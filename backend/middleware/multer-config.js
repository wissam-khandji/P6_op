//require
const multer = require("multer");

//objet mime types pour extension des fichiers
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
};

//fonction qui stocke et renomme les fichiers reçus
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    }
});

//fonction qui filtre les fichier en fonction de leur extension et qui n'accepte que les .jpg et les .png
const fileFilter = (req, file, callback) => {
    const ext = MIME_TYPES[file.mimetype];
    if(ext === "jpg" || ext === "png") {
        callback(null, true);
    } else {
        callback(new Error ("Mauvais format de fichiers"), false);
    }
}

//exportation de multer avec l'objet, une limite à 80mo par fichier et le filtre d'extension
module.exports = multer({storage, limits: {fileSize: 838886080}, fileFilter}).single("image"); 