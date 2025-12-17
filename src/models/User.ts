
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Census Data
    occupation: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },

    // Expanded Profile Data
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    annualIncome: { type: Number },
    employmentStatus: { type: String, enum: ['Employed', 'Unemployed', 'Student', 'Retired'] },
    educationLevel: { type: String },

    createdAt: { type: Date, default: Date.now },
}, {
    collection: 'Users'
});

export default mongoose.models.User || mongoose.model('User', userSchema);
