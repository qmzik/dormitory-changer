import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const GoodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ownerId: { type: Number, required: true },
    change: String,
    comments: [Number],
});

GoodSchema.plugin(validator);
GoodSchema.plugin(AutoIncrement, { inc_field: 'goodId' });

export default mongoose.model<IGood>('Good', GoodSchema);

export interface IGood extends Document {
    name: string;
    description: string;
    change: string;
    comments: number[];
}
