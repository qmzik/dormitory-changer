import express, { Request, Response, NextFunction } from 'express';
import Good, { IGood } from '../models/good';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import { mongoURI } from '../consts/config';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import { Grid as GridType } from '@types/gridfs-stream';

const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

let gfs: GridType;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('goods');
});

const goodsStorage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.id,
            bucketName: 'goods',
        };
    },
});

const upload = multer({ storage: goodsStorage });

const app = express();

const DEFAULT_LIMIT = 20;

app.post('/', upload.single('picture'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const goodInfo = { ...req.body, pictureId: req.file.id };
        const good: IGood = new Good(goodInfo);
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

app.get('/picture', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { goodId } = req.query;
        const good = await Good.findOne({ goodId }, { _id: 0, __v: 0 }).lean();

        if (good === null) {
            return res.status(404).json({ error: `Good was not found by goodId ${goodId}` });
        }

        const pictureRes = await gfs.files.findOne({ _id: good.pictureId });

        if (!pictureRes || pictureRes.length === 0) {
            return res.status(404).json({ error: 'No file exists' });
        }

        const readstream = await gfs.createReadStream(pictureRes._id);

        readstream.pipe(res);
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

        await Good.findOneAndUpdate({ goodId: good.goodId }, good);

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
