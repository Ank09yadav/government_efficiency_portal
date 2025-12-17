
import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true }, // For Admin Login
    password: { type: String }, // For Admin Login
    head: { type: String, required: true },
    budget: { type: Number, required: true },
    description: { type: String },
    metrics: {
        filesCleared: { type: Number, default: 0 },
        pendingFiles: { type: Number, default: 0 },
        efficiency: { type: Number, default: 0 }, // percentage
    },
    createdAt: { type: Date, default: Date.now },

}, {
    collection: 'Gov'
});

export default mongoose.models.Department || mongoose.model('Department', departmentSchema);
