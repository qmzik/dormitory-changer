import express, { Request, Response, NextFunction } from 'express';
import Good, { IGood } from '../models/good';
import User, { IUser } from '../models/user';

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

app.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const good: IGood = req.body;

        Good.findOneAndUpdate({ goodId: good.goodId }, good);

        res.status(200);
    } catch (error) {
        next(error);
    }
});

app.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { goodId, userId } = req.body;
        const user: IUser = await User.findOne({ userId }, { _id: 0, __v: 0 }).lean();

        if (user === null) {
            res.status(404).json({ message: `User with id ${userId} was not found` });

            return;
        }

        if (user.goods.indexOf(goodId) === -1) {
            res.status(404).json({ message: `User with id ${userId} does not have a good with id ${goodId}` });

            return;
        }
        await Good.findOneAndDelete({ goodId });

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

export default app;
