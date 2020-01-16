import express, { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();

app.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(req.body.password, salt);
        const { email, dormitoryId } = req.body;

        const user = new User({ email, password, dormitoryId });
        await user.save();

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ email: req.body.email }, { _id: 0, __v: 0 }).lean();
        if (user === null) {
            res.status(404).json({ message: 'User was not found' });

            return;
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            res.status(403).json({ message: 'Wrong credentials' });
        }

        const { userId, email, dormitoryId, goods, name } = user;
        const token = jwt.sign({ data: user.email }, process.env.SECRET, { expiresIn: '1h' });


        res.status(200).json({ token, user: { userId, email, dormitoryId, goods, name: name ? name : email } });
    } catch (error) {
        next(error);
    }
});

export default app;
