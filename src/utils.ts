import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const checkRights = async (req: Request, userId: number): Promise<boolean> => {
    console.log(req.headers);
    const decoded = await jwt.verify(req.headers.authorization, process.env.SECRET);

    console.log('decoded', decoded);

    return (decoded as { data: number }).data === userId;
};

export const prepareDataObject = (obj: object): object => {
    const result = {};

    Object.entries(obj).forEach(([key, val: any]) => {
        if (val !== undefined) {
            // @ts-ignore
            result[key] = isNaN(val) ? val : Number(val);
        }
    });

    return result;
};
