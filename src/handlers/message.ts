import express, { Request, Response, NextFunction } from 'express';
import Message, { IMessage } from '../models/message';
import { ICountFilter } from '../types';
import { prepareDataObject } from '../utils';

const DEFAULT_COUNT = 20;

const app = express();

export const createMessage = async (ownerId: number, to: number, content: string): Promise<void> => {
    try {
        const timestamp = Date.now();
        const message: IMessage = new Message({ ownerId, to, content, timestamp });

        await message.save();
    } catch (error) {
        throw error;
    }
};

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ownerId, to } = req.query;
        const { count, offset }: ICountFilter = req.query;

        const messages = await Message.find(prepareDataObject({ ownerId, to }), { _id: 0, __v: 0 }).sort({ timestamp: -1 })
            .limit(count || DEFAULT_COUNT).skip(offset || 0).lean();

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export default app;
