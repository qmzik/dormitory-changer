import env from 'dotenv';

env.config();

// tslint:disable-next-line:max-line-length
export const mongoURI = `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@booker-azmmz.mongodb.net/booker?retryWrites=true&w=majority`;
