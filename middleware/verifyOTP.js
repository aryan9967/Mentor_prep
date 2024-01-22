import twilio from 'twilio';
import dotenv from 'dotenv';

// Configure env
dotenv.config();

export const verifyOTP = async (req, res) => {
    const { phone, code } = req.body;

    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    const twilio_service_sid = process.env.twilio_service_sid;
    console.log('Account SID:', accountSid);

    const client = twilio(accountSid, authToken);
    try {
        const verificationCheck = await client.verify.services(twilio_service_sid).verificationChecks.create({
            to: `+${phone}`,
            code,
        });

        if (verificationCheck.status === 'approved') {
            // Code is valid, perform user authentication here
            // You can use Firebase Authentication to sign in the user
            res.status(200).json({ success: true, verificationCheck });
        } else {
            res.status(401).json({ success: false, message: 'Invalid verification code' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
