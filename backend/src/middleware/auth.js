import jwt from 'jsonwebtoken';

export const invalidatedTokens = new Set();

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: "Un token est requis pour l'authentification" });
  }
  try {
    if (invalidatedTokens.has(token)) {
      return res.status(401).json({ message: "Token invalide" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
  return next();
};