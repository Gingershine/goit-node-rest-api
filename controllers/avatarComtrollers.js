import * as fs from 'fs/promises';
import path from 'path';
import User from '../models/users.js';
import Jimp from 'jimp';
import crypto from 'crypto';
import mail from '../mail.js';

async function updateAvatar(req, res, next) {
    try {
        const newPath = path.resolve('public', 'avatars', req.file.filename);
        await fs.rename(req.file.path, newPath);
        const image = await Jimp.read(newPath);
        image.resize(250, 250).write(newPath);

        const avatarURL = `/avatars/${req.file.filename}`;
                
        const user = await User.findByIdAndUpdate(req.user.userId, { avatarURL }, { new: true });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({avatarURL: user.avatarURL});
    } catch (error) {
        next(error);
    }
}

async function verifyEmail(req, res, next) {
    try {
        const { verificationToken } = req.params;
            
        const user = await User.findOne({ verificationToken: verificationToken });
    
        if (user === null) {
          return res.status(404).send({ message: "User not found" });
        }
    
        await User.findByIdAndUpdate(user._id, {
          
          verify: true,
          verificationToken: null,
        });
            
        res.send({ message: "Verification successful" });
      } catch (error) {
        next(error);
      }
    }

async function sendEmail(req, res, next) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "missing required field email" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (user.verify) {
            return res.status(400).send({ message: "Verification has already been passed" });
        }

        const verificationToken = crypto.randomUUID();
        mail.sendMail({
            to: email,
            from: "sevastyanovy@gmail.com",
            subject: "Welcome!",
            html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`            
        })
        await User.findByIdAndUpdate(user._id, { verificationToken }, { new: true });
        res.status(200).send({ message: "Verification email has been sent" });
    } catch (error) {
        next(error);
    }   
}



export default {updateAvatar, verifyEmail, sendEmail};