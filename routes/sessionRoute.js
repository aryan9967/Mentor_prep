import express from 'express';
import { createSessionController, readSessionsController, singleSessionController } from '../controllers/sessionController.js';


// import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';


//route object
const router = express.Router();

//routing
//Create || POST
router.post('/create', createSessionController);
router.get('/read', readSessionsController);
router.post('/single', singleSessionController);


export default router;