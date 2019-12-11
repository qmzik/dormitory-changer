import express, { Request, Response, NextFunction } from 'express';
import Comment, { IComment } from '../models/comment';
import Good, { IGood } from '../models/good';

const app = express();

app.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { goodId, ownerId, content  } = req.body;

        // @ts-ignore
        const good: IGood = await Good.findOne({ goodId });
        console.log(good);

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
        const comments: IComment[] = await Comment.find(req.query, { _id: 0, __v: 0 }).lean();

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
});

app.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment: IComment = req.body;

        await Comment.findOneAndUpdate({ commentId: comment.commentId }, comment);

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.body;

        await Comment.findOneAndDelete({ commentId });

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

export default app;
