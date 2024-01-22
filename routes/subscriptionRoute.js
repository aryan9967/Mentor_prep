import express from 'express';
import { createSubscriptionController, readSubscriptionController, singleSubscriptionController } from '../controllers/subscriptionController.js';

// import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



//route object
const router = express.Router();

//routing
//Create || POST
router.post('/create', createSubscriptionController);
router.post('/read', readSubscriptionController);
router.post('/single', singleSubscriptionController);


export default router;