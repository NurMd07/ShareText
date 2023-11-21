import mongoose from 'mongoose';

const { Schema } = mongoose;

const textSchema = new Schema({ 
    text: { type: String, required: true },
    created: { type: Date, default: Date.now },
    important: { type: Boolean, default: false },
    pin: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Text', textSchema);
