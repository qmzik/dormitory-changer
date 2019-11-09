import mongoose, { Document, Schema } from 'mongoose';
import validator from 'mongoose-unique-validator';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const DormitorySchema = new Schema({
    name: { type: String, required: true },
});

DormitorySchema.plugin(validator);
DormitorySchema.plugin(AutoIncrement, { inc_field: 'dormitoryId' });

export default mongoose.model<IDormitory>('Dormitory', DormitorySchema);

export interface IDormitory extends Document {
    name: string;
}
