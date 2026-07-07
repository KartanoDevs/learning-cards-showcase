import { Router } from 'express';
import {
  listCards,
  listCardsByGroup,
  listCardsRandom,
  createCard,
  updateCard,
  hideCard,
  showCard,
} from '../controllers/cards.controller';

const router = Router();

// Listado
router.get('/random', listCardsRandom);             // muestra aleatoria (no paginada)
router.get('/', listCards);                         // listado normal / paginado / shuffle
router.get('/group/:groupId', listCardsByGroup);    // listado por grupo (mismas options)

// CRUD
router.post('/', createCard);
router.patch('/:id', updateCard);
router.post('/:id/hide', hideCard);
router.post('/:id/show', showCard);

export default router;
