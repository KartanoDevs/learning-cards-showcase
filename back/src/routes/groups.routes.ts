import { Router } from 'express';
import {
  listGroups,
  getGroupById, // <-- Importamos
  createGroup,
  updateGroupName,
  updateGroup,
  hideGroup,
  showGroup,
} from '../controllers/groups.controller';

const router = Router();

router.get('/', listGroups);
router.post('/', createGroup);
router.patch( '/:id/name', updateGroupName );
router.patch( '/:id', updateGroup );
router.post('/:id/hide', hideGroup);
router.post('/:id/show', showGroup);
router.get( '/:id', getGroupById ); // <-- Registramos la ruta al final (o antes)

export default router;