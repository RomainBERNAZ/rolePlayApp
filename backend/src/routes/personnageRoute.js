import express from 'express';
import personnageController from '../controllers/personnageController.js';

const router = express.Router();

router.post('/', personnageController.creerPersonnage);
router.get('/', personnageController.obtenirPersonnages);
router.get('/:id', personnageController.obtenirPersonnageParId);
router.put('/:id', personnageController.mettreAJourPersonnage);
router.delete('/:id', personnageController.supprimerPersonnage);

export default router;