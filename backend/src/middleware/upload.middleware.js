const multer = require("multer");

// Configuration de stockage en mémoire pour traitement direct (Cloudinary)
const storage = multer.memoryStorage();

// Configuration de l'upload
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // Limite de 10 MB par fichier
	},
	fileFilter: (req, file, cb) => {
		// Accepter uniquement les images
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Le fichier doit être une image"), false);
		}
	},
});

module.exports = upload;
