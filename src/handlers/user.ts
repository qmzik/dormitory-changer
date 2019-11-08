import express, { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const app = express();

app.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new User(req.body);
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

        const { user_id } = user;
        const token = jwt.sign({ data: user.email }, process.env.SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user_id });
    } catch (error) {
        next(error);
    }
});

export default app;
