import express, { Request, Response, NextFunction } from 'express';
import Good, { IGood } from '../models/good';

const app = express();

const DEFAULT_LIMIT = 20;

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

app.get('/find', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, limit } = req.query;
        const findString = q || '';

        const goods: IGood[] = await Good.find({
            $or: [
                { name: { $regex: findString } },
                { description: { $regex: findString } },
                { change: { $regex: findString } },
            ],
        }).limit(checkLimit(limit) ? limit : DEFAULT_LIMIT).lean();

        res.status(200).json(goods);
    } catch (error) {
        next(error);
    }
});

app.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const good: IGood = req.body;

        Good.findOneAndUpdate({ goodId: good.goodId }, good);

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { goodId } = req.body;

        await Good.findOneAndDelete({ goodId });

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

function checkLimit(limit: any): boolean {
    return typeof limit === 'number' && limit > 0;
}

export default app;
