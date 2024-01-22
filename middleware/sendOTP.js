import twilio from 'twilio';
import dotenv from 'dotenv';

// Configure env
dotenv.config();

export const sendOTP = async (req, res) => {
  const { phone } = req.body;
  const accountSid = process.env.accountSid;
  const authToken = process.env.authToken;
  const twilio_service_sid = process.env.twilio_service_sid;

  console.log('Account SID:', accountSid);

  const client = twilio(accountSid, authToken);
  try {
    const verificationRequest = await client.verify.services(twilio_service_sid).verifications.create({
      to: `+${phone}`,
      channel: 'sms',
    });

    res.status(200).json({ success: true, verificationRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}