const handleError = (res, error, statusCode = 500) => {
    console.error('Erreur:', error);
    res.status(statusCode).json({ message: error.message });
  };
  
export default handleError;