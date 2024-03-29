import JWT from 'jsonwebtoken';
import { admin } from '../DB/firestore.js';
import { readSingleData } from '../helper/crumd.js';
const db = admin.firestore();

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the token from the request headers
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is required. Please login again.',
      });
    }

    const decode = JWT.verify(token, process.env.JWT_token);
    req.token = decode;
    console.log(decode);
    next();
  } catch (error) {
    console.error('Error in token verfication:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in token verfication',
      error: error.message,
    });
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const { admin_phone } = req.body;
    const user = await readSingleData(process.env.mentorsCollectionName, admin_phone);
    if (user.role !== 2) {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access',
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: 'Error in Admin Access',
      error: error,
    });
  }
};
