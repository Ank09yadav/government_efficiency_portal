
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Added for Login
    rank: { type: Number, default: 0 }, // 0 = standard, 1-10 = high rank
    isPublicContact: { type: Boolean, default: false }, // Show on website

    // Census Data
    occupation: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },

    metrics: {
        attendance: { type: Number, default: 0 }, // percentage
        tasksCompleted: { type: Number, default: 0 },
        efficiencyScore: { type: Number, default: 0 }, // 0-100
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
