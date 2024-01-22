import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { readSingleData, updateData } from "../helper/crud.js";
import { sms } from "../helper/sms.js";
import { mail } from "../helper/mail.js";
// import * as admin from 'firebase-admin';
import mime from 'mime';
import multer from 'multer';
import { matchData, readAllData, readFieldData, readSingleData, updateData } from "../helper/crumd.js";

// Initialize multer for handling file uploads
const upload = multer();

const storage = getStorage(fapp);

export const listMentorsController = async (req, res) => {
    try {
        const { phone } = req.body;
        //Validtion
        if (!phone) {
            //Retrieve user data
            let mentors = await readAllData(process.env.mentorsCollectionName);
            //validating user
            if (!mentors) {
                return res.status(404).send({
                    success: false,
                    message: 'No mentors still exists',
                });
            }
            const mentorData = []
            mentors.forEach(async (mentor) => {
                if (mentor.approved === true) {
                    mentorData.push(mentor);
                }
            })
            res.status(200).send({
                success: true,
                message: 'All Mentors List',
                mentors: mentorData,
            });
        } else {
            const preferences = await readFieldData(process.env.menteesCollectionName, phone, 'preference');
            console.log(preferences);
            const mentors = await readAllData(process.env.mentorsCollectionName);
            var mentorData = [];
            mentors.forEach(async (mentor, index1) => {
                //Retrieve user data

                if (mentor.approved === true) {
                    const professions = mentor.profession;
                    console.log(index1);
                    console.log(professions);
                    professions.forEach(async (profession, index2) => {
                        preferences.forEach(async (preference, index3) => {
                            if (preference === profession) {
                                mentorData.push(mentor);
                            }
                        })
                    })
                }
            });
            res.status(200).send({
                success: true,
                message: 'All Mentors List with preference',
                mentors: mentorData,
            });


        }
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

export const mentorDetailsController = async (req, res) => {
    try {
        const { mentor_phone } = req.body;
        if (!mentor_phone) {
            return res.send({ message: 'Mentor phone number is not provided' });
        }


        const mentorData = await readSingleData(process.env.mentorsCollectionName, mentor_phone);

        console.log('success');

        // mail('amitasharma.m@gmail.com');

        return res.status(201).send({
            success: true,
            message: 'Mentor details',
            mentor_details: mentorData,
        });
    } catch (error) {
        console.error('Error in Mentor details:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in getting mentor details',
            error: error.message,
        });
    }
};