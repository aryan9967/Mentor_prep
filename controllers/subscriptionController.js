import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { matchData, readFieldData, updateData } from "../helper/crumd.js";
// import * as admin from 'firebase-admin';

export const createSubscriptionController = async (req, res) => {
    try {
        const { mentee_phone, mentor_phone, subscriptionId, title, description, paid, rate, start_date, end_date } = req.body;
        if (!mentee_phone) {
            return res.send({ message: 'Mentee name is required' });
        }
        if (!mentor_phone) {
            return res.send({ message: 'Mentor name is required' });
        }
        if (!subscriptionId) {
            return res.send({ message: 'Mentor name is required' });
        }
        if (!description) {
            return res.send({ message: 'Description is required' });
        }
        if (!title) {
            return res.send({ message: 'Title is required' });
        }
        if (!paid) {
            return res.send({ message: 'Paid Status is required' });
        }
        if (!rate) {
            return res.send({ message: 'Rate is required' });
        }
        if (!start_date) {
            return res.send({ message: 'Start date is required' });
        }
        if (!end_date) {
            return res.send({ message: 'End date is required' });
        }
        //existing session
        const menteeSubscriptions = await readFieldData(process.env.menteesCollectionName, mentee_phone, 'subscription');
        const subscriptionData = {};

        var len = Object.keys(menteeSubscriptions).length;
        for (var i = 0; i < len; i++) {
            subscriptionData[i] = menteeSubscriptions[i];
            var id = menteeSubscriptions[i][0].subscriptionId;
            if (subscriptionId === id) {
                return res.status(201).send({
                    success: true,
                    message: 'Subscription already exists',
                });
            }
        }


        const weeklySchedule = [];
        let currentDate = new Date(start_date);
        const finish_date = new Date(end_date);

        while (currentDate <= finish_date) {
            const subscriptionJson = {
                subscriptionId: subscriptionId,
                mentor: mentor_phone,
                mentee: mentee_phone,
                description: description,
                schedule: currentDate,
                title: title,
                rate: rate,
                paid: paid
            };
            weeklySchedule.push(subscriptionJson);
            currentDate.setDate(currentDate.getDate() + 7);
        }
        subscriptionData[len] = weeklySchedule
        await updateData(process.env.menteesCollectionName, mentee_phone, "subscription", subscriptionData);
        await updateData(process.env.mentorsCollectionName, mentor_phone, "subscription", subscriptionData);

        return res.status(201).send({
            success: true,
            message: 'Session created successfully',
            schedule: subscriptionData
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


export const readSubscriptionController = async (req, res) => {
    try {
        const { phone, role } = req.body;
        var subsData
        if (role === 0) {
            subsData = await readFieldData(process.env.menteesCollectionName, phone, "subscription");
        } else if (role === 1) {
            subsData = await readFieldData(process.env.mentorsCollectionName, phone, "subscription");
        }

        return res.status(201).send({
            success: true,
            message: 'Subscription readed successfully',
            subscription: subsData,
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


export const singleSubscriptionController = async (req, res) => {
    try {
        const { phone, role, subscriptionId } = req.body;
        var menteeSubscriptions;
        if (role === 0) {

            menteeSubscriptions = await readFieldData(process.env.menteesCollectionName, phone, 'subscription');

        } else if (role === 1) {
            menteeSubscriptions = await readFieldData(process.env.mentorsCollectionName, phone, 'subscription');

        }
        const subscriptionData = {};

        var len = Object.keys(menteeSubscriptions).length;
        for (var i = 0; i < len; i++) {
            subscriptionData[i] = menteeSubscriptions[i];
            var id = menteeSubscriptions[i][0].subscriptionId;
            if (subscriptionId === id) {
                return res.status(201).send({
                    success: true,
                    message: 'Single Subscription readed successfully',
                    data: menteeSubscriptions[i],
                    phone: phone
                });
                // }
            }
        }
        // const test = subscription_data[mentee_username]

        return res.status(201).send({
            success: false,
            message: 'No such single subscription readed successfully',
            subscription: subData,
            // test: test,
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