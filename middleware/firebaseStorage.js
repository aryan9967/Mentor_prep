import { admin } from "../DB/firestore.js";
const db = admin.firestore();
import { fapp } from "../DB/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import multer from 'multer';
import mime from 'mime';
import { matchData } from "../helper/crumd.js";

// Initialize multer for handling file uploads
const upload = multer();

const storage = getStorage(fapp);

export const firebaseStorage = async (req, res, next) => {
    try {
        upload.single('resume')(req, res, async (err) => {
            if (err) {
                return res.status(500).send({ success: false, message: 'Error uploading file' });
            }

            const { phone } = req.body;
            // Check for existing user
            const querySnapshot = await matchData(process.env.mentorsCollectionName, "phone", phone);
            if (!querySnapshot.empty) {
                return res.status(200).send({
                    success: false,
                    message: 'Mentor already registered. Please login.',
                });
            }
            const reqFile = req.file;
            const mimeType = req.file.mimetype;

            // Get the file extension
            const fileExtension = mime.getExtension(mimeType);
            const bucket = admin.storage().bucket();

            const folderPath = 'resume'; // Replace with your desired folder path
            const fileName = phone + '.' + fileExtension;
            const filePath = `${folderPath}/${fileName}`;
            const file = bucket.file(filePath);
            const stream = file.createWriteStream({
                metadata: {
                    contentType: 'application/pdf'
                }
            });
            stream.on('error', (err) => {
                console.log(err);
                // res.status(500).send("Error uploading file");
            });
            let signedUrl; // Declare the variable outside the stream event handlers

            stream.on("finish", async () => {
                // Get the signed URL for the uploaded file
                signedUrl = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2025', // Set an expiration date for the URL
                });
                console.log("Resume Uploaded Successfully");
                req.body.resumeURL = signedUrl;
                req.resumeURL = signedUrl;
                next();
            });
            stream.end(req.file.buffer);
        });
    } catch (error) {

        console.log(error);
        res.status(401).send({
            success: false,
            message: 'Error in Firebase Strorage',
            error: error,
        });
    }
}