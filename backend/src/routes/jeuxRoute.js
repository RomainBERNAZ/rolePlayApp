import express from 'express';
import jeuController from '../controllers/jeuController.js';

const router = express.Router();

router.post('/', jeuController.creerJeu);
router.get('/', jeuController.obtenirJeux);
router.get('/:id', jeuController.obtenirJeuParId);
router.put('/:id', jeuController.mettreAJourJeu);
router.patch('/:id/addPersonnage', jeuController.ajouterPersonnage);
router.delete('/:id/removePersonnage/:personnageId', jeuController.retirerPersonnage);
router.delete('/:id/removePlayer/:playerId', jeuController.retirerJoueur);
router.delete('/:id', jeuController.supprimerJeu);

export default router;