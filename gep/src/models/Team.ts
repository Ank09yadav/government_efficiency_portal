
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    lead: { type: String, required: true },
    project: { type: String },
    members: [{ type: String }], // Array of member names or IDs
    metrics: {
        tasksCompleted: { type: Number, default: 0 },
        tasksPending: { type: Number, default: 0 },
        avgCompletionTime: { type: Number, default: 0 }, // in hours
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
