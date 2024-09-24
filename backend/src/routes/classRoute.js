import express from 'express';
import classeController from '../controllers/classeController.js';

const router = express.Router();

router.post('/', classeController.createClasse);
router.get('/', classeController.getAllClasses);
router.get('/:id', classeController.getClasseById);
router.put('/:id', classeController.updateClasse);
router.delete('/:id', classeController.deleteClasse);
router.get('/jeu/:jeuId', classeController.getClassesByJeuId);

export default router;
