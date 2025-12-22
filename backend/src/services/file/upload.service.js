const cloudinary = require('cloudinary').v2;
const { CLOUDINARY } = require('../../config/env');
const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

/**
 * Service d'upload d'images avec Cloudinary
 */
class UploadService {
  /**
   * Uploader une image sur Cloudinary
   * @param {Buffer|string} file - Fichier à uploader (buffer ou path)
   * @param {object} options - Options d'upload
   * @returns {Promise<object>} Informations sur l'image uploadée
   */
  async uploadImage(file, options = {}) {
    try {
      if (!CLOUDINARY.CLOUD_NAME || !CLOUDINARY.API_KEY || !CLOUDINARY.API_SECRET) {
        logger.warn('Cloudinary non configuré, utilisation du mode de développement');
        // En développement, retourner une URL factice si Cloudinary n'est pas configuré
        return {
          url: 'https://via.placeholder.com/800x600?text=Image+Upload',
          public_id: `dev_${Date.now()}`,
          secure_url: 'https://via.placeholder.com/800x600?text=Image+Upload',
        };
      }

      const {
        folder = 'agroboost/services',
        transformation = [],
        resource_type = 'image',
      } = options;

      const uploadOptions = {
        folder,
        resource_type,
        overwrite: false,
        invalidate: true,
      };

      // Ajouter des transformations si spécifiées
      if (transformation.length > 0) {
        uploadOptions.transformation = transformation;
      }

      // Upload selon le type de fichier
      let result;
      if (Buffer.isBuffer(file)) {
        // Upload depuis un buffer (multer)
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, uploadResult) => {
              if (error) {
                logger.error('Erreur upload Cloudinary:', error);
                reject(new AppError('Échec de l\'upload de l\'image', 500));
              } else {
                resolve({
                  url: uploadResult.url,
                  public_id: uploadResult.public_id,
                  secure_url: uploadResult.secure_url,
                  width: uploadResult.width,
                  height: uploadResult.height,
                  format: uploadResult.format,
                });
              }
            }
          );
          
          uploadStream.end(file);
        });
      } else {
        // Upload depuis un path
        result = await cloudinary.uploader.upload(file, uploadOptions);
        
        return {
          url: result.url,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
        };
      }
    } catch (error) {
      logger.error('Erreur lors de l\'upload Cloudinary:', error);
      throw new AppError('Échec de l\'upload de l\'image', 500);
    }
  }

  /**
   * Uploader plusieurs images
   * @param {Array<Buffer|string>} files - Fichiers à uploader
   * @param {object} options - Options d'upload
   * @returns {Promise<Array>} Liste des images uploadées
   */
  async uploadMultipleImages(files, options = {}) {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, options));
      return Promise.all(uploadPromises);
    } catch (error) {
      logger.error('Erreur lors de l\'upload multiple:', error);
      throw new AppError('Échec de l\'upload des images', 500);
    }
  }

  /**
   * Supprimer une image de Cloudinary
   * @param {string} publicId - Public ID de l'image
   * @returns {Promise<object>} Résultat de la suppression
   */
  async deleteImage(publicId) {
    try {
      if (!CLOUDINARY.CLOUD_NAME || !CLOUDINARY.API_KEY || !CLOUDINARY.API_SECRET) {
        logger.warn('Cloudinary non configuré, suppression ignorée');
        return { result: 'ok' };
      }

      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      logger.error('Erreur lors de la suppression Cloudinary:', error);
      throw new AppError('Échec de la suppression de l\'image', 500);
    }
  }

  /**
   * Générer une URL optimisée pour une image
   * @param {string} publicId - Public ID de l'image
   * @param {object} options - Options de transformation
   * @returns {string} URL optimisée
   */
  getOptimizedUrl(publicId, options = {}) {
    const {
      width = 800,
      height = 600,
      crop = 'limit',
      quality = 'auto',
      format = 'auto',
    } = options;

    if (!CLOUDINARY.CLOUD_NAME || !publicId) {
      return null;
    }

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      format,
      secure: true,
    });
  }
}

module.exports = new UploadService();

