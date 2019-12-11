import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const GoodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ownerId: { type: Number, required: true },
    change: String,
    comments: [Number],
    urgently: { type: Boolean, default: false },
});

GoodSchema.plugin(validator);
GoodSchema.plugin(AutoIncrement, { inc_field: 'goodId' });

export default mongoose.model<IGood>('Good', GoodSchema);

export interface IGood extends Document {
    goodId: number;
    name: string;
    description: string;
    comments: number[];
    change?: string;
    urgently?: boolean;
}
