import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CommentSchema = new Schema({
    ownerId: { type: Number, required: true },
    goodId: { type: Number, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

CommentSchema.plugin(validator);
CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

export default mongoose.model<IComment>('Comment', CommentSchema);

export interface IComment extends Document {
    commentId: number;
    ownerId: number;
    goodId: number;
    content: string;
    timestamp: number;
}
