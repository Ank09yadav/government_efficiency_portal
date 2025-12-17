
import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema);
