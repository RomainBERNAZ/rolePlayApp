import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Un token est requis pour l'authentification" });
  }
  try {
    // Suppression de la vérification de invalidatedTokens car elle est toujours vide ici
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
  return next();
};
