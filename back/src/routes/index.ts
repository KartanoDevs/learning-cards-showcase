import { Router } from 'express';
import cards from './cards.routes';
import groups from './groups.routes';

const router = Router();

router.use('/cards', cards);
router.use('/groups', groups);

export default router;
