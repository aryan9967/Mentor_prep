import express from 'express';
import { menteeRegisterController, menteesLoginController, mentorsLoginController, mentorsRegisterController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { sendOTP } from '../middleware/sendOTP.js';
import { verifyOTP } from '../middleware/verifyOTP.js';
import { firebaseStorage } from '../middleware/firebaseStorage.js';



//route object
const router = express.Router();

//routing
//Register || POST
router.post('/register/mentees', menteeRegisterController);
router.post('/register/mentors', firebaseStorage, mentorsRegisterController);

//Login || POST
router.post('/login/mentees', menteesLoginController);
router.post('/login/mentors', mentorsLoginController);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);


export default router;