import express, { Request, Response, NextFunction } from 'express';
import Good, { IGood } from '../models/good';

const app = express();

app.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const good: IGood = new Good(req.body);
        await good.save();
        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const goods: IGood[] = await Good.find(req.query, { _id: 0, __v: 0 }).lean();

        res.status(200).json(goods);
    } catch (error) {
        next(error);
    }
});

export default app;
