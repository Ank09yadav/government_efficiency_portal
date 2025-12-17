
import mongoose from 'mongoose';

const grievanceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    resolutionNotes: { type: String },

    // Anonymous messaging support
    isAnonymous: { type: Boolean, default: false },
    addressedTo: { type: String }, // Employee ID for private messages

    // Reopen functionality
    reopenedCount: { type: Number, default: 0 },
    canReopen: { type: Boolean, default: true },
    closedAt: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'Grievances'
});

export default mongoose.models.Grievance || mongoose.model('Grievance', grievanceSchema);
