import express from 'express';
import joueurController from '../controllers/joueurController.js';

const router = express.Router();

router.get('/', joueurController.obtenirJoueurs);
router.post('/', joueurController.creerJoueur);
router.get('/:id', joueurController.obtenirJoueurParId);
router.put('/:id', joueurController.mettreAJourJoueur);
router.delete('/:id', joueurController.supprimerJoueur); 

export default router;