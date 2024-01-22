import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { comparePassword, hashPassword } from '../helper/authHelper.js';
import JWT from 'jsonwebtoken';
import { createData, matchData } from "../helper/crumd.js";

export const menteeRegisterController = async (req, res) => {
    try {
        const { phone, password, name, email, address, answer, preference } = req.body;
        //validation
        if (!phone) {
            return res.send({ message: 'Name is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!address) {
            return res.send({ message: 'Address is required' });
        }
        if (!answer) {
            return res.send({ message: 'Answer is required' });
        }
        if (!preference) {
            return res.send({ message: 'Phone is required' });
        }

        //existing mentee
        const querySnapshot = await matchData(process.env.menteesCollectionName, "phone", phone);
        if (!querySnapshot.empty) {
            return res.status(200).send({
                success: false,
                message: 'User already registered. Please login.',
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);

        const userJson = {
            phone: phone,
            name: name,
            email: email,
            password: hashedPassword,
            address: address,
            answer: answer,
            preference: preference,
            role: 0,
        };
        const userId = phone; // Use phone as the document ID

        if (typeof hashedPassword !== 'string') {
            return res.status(500).send({
                success: false,
                message: 'Error in registration: Invalid password',
            });
        }

        //create database
        await createData(process.env.menteesCollectionName, userId, userJson);
        console.log('success');

        //token
        const token = await JWT.sign(
            { _id: phone },
            process.env.JWT_token,
            {
                expiresIn: '7d',
            }
        );

        return res.status(201).send({
            success: true,
            message: 'Mentee registered successfully',
            user: userJson,
            token
        });
    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in registration',
            error: error.message,
        });
    }
};


//register mentor
export const mentorsRegisterController = async (req, res) => {
    try {
        const {
            phone,
            name,
            email,
            password,
            description,
            education,
            education_desc,
            address,
            age,
            profession,
            experience,
            resumeURL
        } = req.body;

        if (!phone) {
            return res.send({ message: 'Phone is not provided' });
        }
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!description) {
            return res.send({ message: 'Description is required' });
        }
        if (!education) {
            return res.send({ message: 'Description is required' });
        }
        if (!education_desc) {
            return res.send({ message: 'Address is required' });
        }
        if (!address) {
            return res.send({ message: 'Address is required' });
        }
        if (!age) {
            return res.send({ message: 'Age is required' });
        }
        if (!profession) {
            return res.send({ message: 'Profession is required' });
        }
        if (!experience) {
            return res.send({ message: 'Experience is required' });
        }
        if (!resumeURL) {
            return res.status(400).send({ message: 'Resume file is required' });
        }

        // Register user in Firestore
        const hashedPassword = await hashPassword(password);

        const userJson = {
            phone,
            name,
            email,
            password: hashedPassword,
            description,
            education,
            education_desc,
            address,
            age,
            profession,
            experience: 3,
            subscription: [],
            resume: resumeURL,
            approved: false,
            role: 1,
        };

        if (typeof hashedPassword !== 'string') {
            return res.status(500).send({
                success: false,
                message: 'Error in registration: Invalid password',
            });
        }

        // Save mentors details to Firestore
        await createData(process.env.mentorsCollectionName, phone, userJson);
        console.log('Mentor registered successfully');

        //token
        const token = await JWT.sign(
            { _id: phone },
            process.env.JWT_token,
            {
                expiresIn: '7d',
            }
        );

        res.status(201).send({
            success: true,
            message: 'Mentor registered successfully',
            user: userJson,
            token
        });
    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).send({
            success: false,
            message: 'Error in registration',
            error: error.message,
        });
    }
};

export const menteesLoginController = async (req, res) => {
    try {
        const { phone, password } = req.body;
        //Validtion
        if (!phone || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid phone or password',
            });
        }
        //Retrieve user data
        const querySnapshot = await matchData(process.env.menteesCollectionName, 'phone', phone);
        let userData = null;
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
            userData = doc.data();
        });

        //validating user
        if (!userData) {
            return res.status(404).send({
                success: false,
                message: 'Mentor is not registered',
            });
        }

        //comparing user password with hashed/encrypted password
        const match = await comparePassword(password, userData.password);
        //verifying password
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        //token
        const token = await JWT.sign(
            { _id: phone },
            process.env.JWT_token,
            {
                expiresIn: '7d',
            }
        );
        res.status(200).send({
            success: true,
            message: 'Login successfully',
            user: {
                phone: userData.phone,
                name: userData.name,
                email: userData.email,
                address: userData.address,
                age: userData.age,
                subscribed: userData.subscribed,
                preference: userData.preference,
                answer: userData.answer,
                role: userData.role,
            },
            token
        });
        console.log('success');
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login of mentee',
            error: error,
        });
    }
};


export const mentorsLoginController = async (req, res) => {
    try {
        const { phone, password } = req.body;
        //Validtion
        if (!phone || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid phone or password',
            });
        }
        //Retrieve user data
        const querySnapshot = await matchData(process.env.mentorsCollectionName, 'phone', phone);
        let userData = null;
        querySnapshot.forEach((doc) => {
            userData = doc.data();
        });

        //validating user
        if (!userData) {
            return res.status(404).send({
                success: false,
                message: 'Mentor is not registered',
            });
        }

        //comparing user password with hashed/encrypted password
        const match = await comparePassword(password, userData.password);
        //verifying password
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        //token
        const token = await JWT.sign(
            { _id: phone },
            process.env.JWT_token,
            {
                expiresIn: '7d',
            }
        );
        res.status(200).send({
            success: true,
            message: 'Login successfully',
            user: {
                phone: userData.phone,
                name: userData.name,
                email: userData.email,
                contact: userData.contact,
                address: userData.address,
                age: userData.age,
                profession: userData.profession,
                experience: userData.experience,
                subscription: userData.subscription,
                approved: userData.approved,
                role: userData.role,
            },
            token
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
