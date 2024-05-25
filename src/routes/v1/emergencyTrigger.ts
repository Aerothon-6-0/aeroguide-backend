import { Router } from 'express';

import { EmergencyController } from '../../controllers/emergencyTrigger';

const router = Router();

router.post('/', EmergencyController.addEmergency);

export default router;
