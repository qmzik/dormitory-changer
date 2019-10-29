import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const GoodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    change: { type: String, required: true },
    owner_id: { type: Number, required: true },
    comments: [Number],
});

GoodSchema.plugin(validator);
GoodSchema.plugin(AutoIncrement, { inc_field: 'good_id' });

export default mongoose.model<IGood>('Good', GoodSchema);

export interface IGood extends Document {
    name: string;
    description: string;
    change: string,
    comments: number[],
}
