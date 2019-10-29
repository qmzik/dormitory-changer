import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dormitory_id: { type: Number, required: true },
    goods: [Number],
});

UserSchema.plugin(validator);
UserSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

export default mongoose.model<IUser>('User', UserSchema);


export interface IUser extends Document {
    email: string;
    password: string;
    dormitory: number;
    goods: number[];
}
