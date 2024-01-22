import express from 'express';
import { listMentorsController, mentorDetailsController } from '../controllers/userController.js';


import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



//route object
const router = express.Router();

//routing
//Mentors || POST
router.post('/list-mentors', requireSignIn, listMentorsController);
router.post('/mentor-details', mentorDetailsController);

export default router;