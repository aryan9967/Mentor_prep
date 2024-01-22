import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { createData, matchData, readAllData, readFieldData, readSingleData, updateData } from "../helper/crumd.js";
// import * as admin from 'firebase-admin';

export const createSessionController = async (req, res) => {
    try {
        const { name, id, description, mentor_phone, date, paid, price, enrollment } = req.body;
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!id) {
            return res.send({ message: 'Id is required' });
        }
        if (!description) {
            return res.send({ message: 'Description is required' });
        }
        if (!mentor_phone) {
            return res.send({ message: 'Contact is required' });
        }
        if (!date) {
            return res.send({ message: 'Address is required' });
        }
        if (!paid) {
            return res.send({ message: 'Age is required' });
        }
        if (!price) {
            return res.send({ message: 'Preference is required' });
        }
        if (!enrollment) {
            return res.send({ message: 'Preference is required' });
        }

        //existing session
        const querySnapshot = await matchData(process.env.sessionCollectionName, 'id', id);
        if (!querySnapshot.empty) {
            return res.status(200).send({
                success: false,
                message: 'Session already registered. Please create new.',
            });
        }

        const sessionJson = {
            name: name,
            id: id,
            description: description,
            mentor: mentor_phone,
            date: date,
            paid: paid,
            price: price,
            enrollment: enrollment,
        };
        const sessionId = id; // Use email as the document ID
        var sessionData = [];
        // await db.collection(process.env.menteesCollectionName).doc(userId).set(userJson);
        await createData(process.env.sessionCollectionName, sessionId, sessionJson);
        const mentorSession = await readFieldData(process.env.mentorsCollectionName, mentor_phone, 'session');
        if (mentorSession) {
            mentorSession.forEach(async (session) => {
                sessionData.push(session);
            })
            sessionData.push(sessionJson);
        }
        await updateData(process.env.mentorsCollectionName, mentor_phone, "session", sessionData)
        console.log('success');

        return res.status(201).send({
            success: true,
            message: 'Session created successfully',
            session: sessionJson,
        });
    } catch (error) {
        console.error('Error in creating session:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in creating session',
            error: error.message,
        });
    }
};

export const readSessionsController = async (req, res) => {
    try {
        const sessionData = await readAllData(process.env.sessionCollectionName);

        console.log('success');

        return res.status(201).send({
            success: true,
            message: 'Session readed successfully',
            session: sessionData,
        });
    } catch (error) {
        console.error('Error in reading session:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in reading session',
            error: error.message,
        });
    }
};
export const singleSessionController = async (req, res) => {
    try {
        const { session_id } = req.body;
        const sessionData = await readSingleData(process.env.sessionCollectionName, session_id);
        if (!sessionData) {
            return res.status(404).send({
                success: false,
                message: 'NO such session exists',
            });
        }
        console.log('success');

        return res.status(201).send({
            success: true,
            message: 'Session readed successfully',
            session: sessionData,
            id: session_id
        });
    } catch (error) {
        console.error('Error in reading session:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in reading session',
            error: error.message,
        });
    }
};
