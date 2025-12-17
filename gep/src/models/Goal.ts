
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    level: { type: String, enum: ['Organization', 'Team', 'Individual'], required: true },
    relatedId: { type: String, required: true }, // ID of Dept, Team, or Employee
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, required: true }, // e.g., "Files", "Hours", "%"
    deadline: { type: Date },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Goal || mongoose.model('Goal', goalSchema);
