import express, { Request, Response, NextFunction } from 'express';
import Good, { IGood } from '../models/good';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import { mongoURI } from '../consts/config';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import { Grid as GridType } from '@types/gridfs-stream';
import {ICountFilter} from '../types';
import Agenda from 'agenda';

const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

const agenda = new Agenda({ db: { address: mongoURI }, defaultLockLimit: 0, processEvery: '30 seconds' });

agenda.define('removeUrgently', async (job) => {
    const { goodId } = job.attrs.data;
    await Good.findOneAndUpdate({ goodId }, { urgently: false });
    console.log(`urgently removed from good with id ${goodId}`);
});

agenda.start();

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
        const goodInfo = { ...req.body };

        if (req.file) {
            goodInfo.pictureId = req.file.id;
        }
        const good: IGood = new Good(goodInfo);
        await good.save();
        if (req.body.urgently) {
            console.log('here',  good.goodId);
            await agenda.schedule('60 minutes from now', ['removeUrgently'], { goodId: good.goodId });
        }

        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { count, offset }: ICountFilter = req.query;
        const goods: IGood[] = await Good.find(req.query, { _id: 0, __v: 0 }).sort({ urgently: -1 })
            .limit(checkPositiveNumber(count) ? count : DEFAULT_LIMIT).skip(checkPositiveNumber(offset) ? offset : 0).lean();

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
        const { q, count, offset } = req.query;
        const findString = q || '';

        const goods: IGood[] = await Good.find({
            $or: [
                { name: { $regex: findString } },
                { description: { $regex: findString } },
                { change: { $regex: findString } },
            ],
        }).limit(checkPositiveNumber(count) ? count : DEFAULT_LIMIT)
            .skip(checkPositiveNumber(offset) ? offset : 0).lean();

        res.status(200).json(goods);
    } catch (error) {
        next(error);
    }
});

app.patch('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const good: IGood = req.body;

        await Good.findOneAndUpdate({ goodId: good.goodId }, good);

        if (req.body.urgently) {
            await agenda.schedule('60 minutes from now', 'removeUrgently', { goodId: req.body.goodId });
        }

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

function checkPositiveNumber(limit: any): boolean {
    return typeof limit === 'number' && limit >= 0;
}

export default app;
