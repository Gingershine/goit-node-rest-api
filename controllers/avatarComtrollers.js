import * as fs from 'fs/promises';
import path from 'path';
import User from '../models/users.js';
import Jimp from 'jimp';

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

export default updateAvatar;