/**
 * Helper pour réponse de succès
 */
const success = (res, data, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Helper pour réponse d'erreur
 */
const error = (res, message = 'Erreur', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Helper pour réponse paginée
 */
const paginated = (res, data, pagination, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

module.exports = {
  success,
  error,
  paginated,
};

