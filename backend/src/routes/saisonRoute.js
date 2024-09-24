import express from 'express';
import saisonController from '../controllers/saisonController.js';

const router = express.Router();

router.post('/saisons', saisonController.creerSaison);
router.get('/saisons', saisonController.obtenirSaisons);
router.get('/saisons/:id', saisonController.obtenirSaisonParId);
router.put('/saisons/:id', saisonController.mettreAJourSaison);
router.delete('/saisons/:id', saisonController.supprimerSaison);

export default router;
