import express from 'express';
import {
    approveMentorController,
    unapprovedMentorsController
} from '../controllers/adminController.js';


import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



//route object
const router = express.Router();

//routing
//Mentors || POST
router.post('/unapproved-mentors', requireSignIn, isAdmin, unapprovedMentorsController);
router.post('/approve-mentor', requireSignIn, isAdmin, approveMentorController);



export default router;