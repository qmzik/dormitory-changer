import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MessageSchema = new Schema({
    ownerId: { type: Number, required: true },
    to: { type: Number, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

MessageSchema.plugin(validator);
MessageSchema.plugin(AutoIncrement, { inc_field: 'messageId' });

export default mongoose.model<IMessage>('Message', MessageSchema);

export interface IMessage extends Document {
    messageId: number;
    ownerId: number;
    content: string;
    to: number;
    timestamp: number;
}
