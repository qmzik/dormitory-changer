import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import HttpError from './HttpError';
import companyHandler from './handlers/good';
import userHandler from './handlers/user';
import dormitoryHandler from './handlers/dormitory';
import commentHandler from './handlers/comment';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { mongoURI } from './consts/config';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST');

      return res.status(200).json({});
    }
    next();
});

app.use('/dormitory', dormitoryHandler);
app.use('/user', userHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET);

        next();
    } catch (error) {
        next(error);
    }
});
app.use('/good', companyHandler);

app.use('/comment', commentHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HttpError('Not found');
    error.status = 404;
    next(error);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

export default app;
