import express, { Request, Response, NextFunction } from 'express';
import Dormitory, { IDormitory } from '../models/dormitory';

const app = express();

app.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dormitory: IDormitory = new Dormitory(req.body);
        const saved = await dormitory.save();
        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dormitories: IDormitory[] = await Dormitory.find({}, { _id: 0, __v: 0 }).lean();
        res.status(200).json(dormitories);
    } catch (error) {
        next(error);
    }
});

export default app;
