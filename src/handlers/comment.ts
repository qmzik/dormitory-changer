import express, { Request, Response, NextFunction } from 'express';
import Comment, { IComment } from '../models/comment';
import Good, { IGood } from '../models/good';
import {checkRights, prepareDataObject} from '../utils';

const app = express();

app.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { goodId, ownerId, content  } = req.body;

        await checkRights(req, ownerId);

        // @ts-ignore
        const good: IGood = await Good.findOne(prepareDataObject({ goodId }));

        if (!good) {
            res.status(404).json({ message: `Good with id ${goodId} was not found` });
        }

        const timestamp = +new Date();
        const comment: IComment = new Comment({ goodId, ownerId, content, timestamp });

        await comment.save();

        good.comments.push(comment.commentId);

        await good.save();

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { goodId, ownerId, commentId } = req.query;
        const data = prepareDataObject({ goodId, ownerId, commentId });
        const comments: IComment[] = await Comment.find(data, { _id: 0, __v: 0 }).lean();

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
});

app.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content, commentId }: IComment = req.body;

        await Comment.findOneAndUpdate(prepareDataObject({ commentId }), { content });

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.body;

        await Comment.findOneAndDelete(prepareDataObject({ commentId }));

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

export default app;
