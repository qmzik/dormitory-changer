import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dormitoryId: { type: Number, required: true },
    goods: [Number],
});

UserSchema.plugin(validator);
UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

export default mongoose.model<IUser>('User', UserSchema);

export interface IUser extends Document {
    userId: number;
    email: string;
    password: string;
    dormitoryId: number;
    goods: number[];
}
