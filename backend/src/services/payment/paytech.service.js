const axios = require('axios');
const crypto = require('crypto');
const { PAYTECH } = require('../../config/env');
const { AppError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Service d'intégration PayTech pour Mobile Money
 */
class PayTechService {
  /**
   * Générer la signature pour une requête PayTech
   * @private
   */
  _generateSignature(data) {
    const message = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');

    return crypto
      .createHmac('sha256', PAYTECH.API_SECRET)
      .update(message)
      .digest('hex');
  }

  /**
   * Initialiser un paiement PayTech
   * @param {object} paymentData - Données du paiement
   * @returns {Promise<object>} Réponse de PayTech
   */
  async initiatePayment(paymentData) {
    try {
      const {
        amount,
        phoneNumber,
        description = 'Paiement AGRO BOOST',
        bookingId,
        userId,
      } = paymentData;

      if (!PAYTECH.API_KEY || !PAYTECH.API_SECRET || !PAYTECH.MERCHANT_ID) {
        logger.warn('PayTech non configuré, mode simulation activé');
        // Mode simulation pour développement
        return {
          success: true,
          transaction_id: `sim_${Date.now()}_${bookingId}`,
          payment_url: null,
          token: `token_${Date.now()}`,
          message: 'Paiement simulé (PayTech non configuré)',
          simulated: true,
        };
      }

      const requestData = {
        item_name: description,
        item_price: parseFloat(amount),
        currency: 'XOF',
        command_name: `Réservation ${bookingId}`,
        env_token: PAYTECH.MERCHANT_ID,
        ipn_url: `${process.env.API_URL || 'http://localhost:5000'}/api/payments/webhook/paytech`,
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancel`,
        custom_field: JSON.stringify({
          bookingId,
          userId,
          phoneNumber,
        }),
      };

      // Générer la signature
      const signature = this._generateSignature(requestData);
      requestData.hash = signature;

      // Ajouter les credentials
      requestData.api_key = PAYTECH.API_KEY;
      requestData.api_secret = PAYTECH.API_SECRET;

      const apiUrl = `${PAYTECH.BASE_URL}/api/payment/request-payment`;

      logger.info(`Initialisation paiement PayTech: ${bookingId}, montant: ${amount}`);

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          transaction_id: response.data.transaction_id || response.data.token,
          payment_url: response.data.payment_url || response.data.url,
          token: response.data.token || response.data.transaction_id,
          message: response.data.message || 'Paiement initialisé',
        };
      }

      throw new AppError(
        response.data?.message || 'Échec de l\'initialisation du paiement PayTech',
        400
      );
    } catch (error) {
      logger.error('Erreur PayTech initiatePayment:', error);
      
      if (error.response) {
        throw new AppError(
          error.response.data?.message || 'Erreur lors de l\'initialisation du paiement',
          error.response.status || 500
        );
      }

      throw new AppError('Erreur de communication avec PayTech', 500);
    }
  }

  /**
   * Vérifier le statut d'un paiement PayTech
   * @param {string} transactionId - ID de la transaction
   * @returns {Promise<object>} Statut du paiement
   */
  async verifyPayment(transactionId) {
    try {
      if (!PAYTECH.API_KEY || !PAYTECH.API_SECRET) {
        logger.warn('PayTech non configuré, vérification simulée');
        return {
          success: true,
          status: 'success',
          transaction_id: transactionId,
          simulated: true,
        };
      }

      const requestData = {
        token: transactionId,
        api_key: PAYTECH.API_KEY,
        api_secret: PAYTECH.API_SECRET,
      };

      const signature = this._generateSignature(requestData);
      requestData.hash = signature;

      const apiUrl = `${PAYTECH.BASE_URL}/api/payment/verify`;

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return {
        success: response.data?.success || false,
        status: response.data?.status || 'pending',
        transaction_id: transactionId,
        amount: response.data?.amount,
        currency: response.data?.currency,
        message: response.data?.message,
      };
    } catch (error) {
      logger.error('Erreur PayTech verifyPayment:', error);
      throw new AppError('Erreur lors de la vérification du paiement', 500);
    }
  }

  /**
   * Vérifier la signature d'un webhook PayTech
   * @param {object} webhookData - Données du webhook
   * @param {string} receivedSignature - Signature reçue
   * @returns {boolean} True si la signature est valide
   */
  verifyWebhookSignature(webhookData, receivedSignature) {
    if (!PAYTECH.WEBHOOK_SECRET) {
      logger.warn('PayTech WEBHOOK_SECRET non configuré, signature non vérifiée');
      return true; // En développement, accepter si pas de secret configuré
    }

    const calculatedSignature = this._generateSignature(webhookData);
    return calculatedSignature === receivedSignature;
  }
}

module.exports = new PayTechService();

