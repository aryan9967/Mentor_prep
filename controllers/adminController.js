import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { comparePassword, hashPassword } from '../helper/authHelper.js';
import { matchData, readSingleData, updateData } from "../helper/crumd.js";

export const unapprovedMentorsController = async (req, res) => {
    try {
        const { mentor_phone } = req.body;
        //Validtion
        if (!mentor_phone) {
            return res.status(404).send({
                success: false,
                message: 'Phone is not provided',
            });
        }

        //Retrieve user data
        const querySnapshot = await matchData(process.env.mentorsCollectionName, 'approved', false);
        let userData = [];
        querySnapshot.forEach((doc) => {
            userData.push(doc.data());
        });

        //validating user
        if (!userData) {
            return res.status(404).send({
                success: false,
                message: 'No mentors still exists',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Unapproved Mentors List',
            unapprovedMentors: userData
        });
        console.log('success');
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login of mentor',
            error: error,
        });
    }
};


export const approveMentorController = async (req, res) => {
    try {
        const { mentor_phone } = req.body;
        //Validtion
        if (!mentor_phone) {
            return res.status(404).send({
                success: false,
                message: 'Mentor phone is not provided',
            });
        }

        // Reference to the Firestore document
        const mentorRef = await updateData(process.env.mentorsCollectionName, mentor_phone, "approved", true);

        const mentor_data = await readSingleData(process.env.mentorsCollectionName, mentor_phone);

        res.status(200).send({
            success: true,
            message: 'Approved Mentor',
            mentor: mentor_data,
        });
        console.log('success');
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login of mentor',
            error: error,
        });
    }
};
