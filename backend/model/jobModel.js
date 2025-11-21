const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: [String],
        default: [],
    },
    
    // 2. Budget and Timeline
    budgetType: {
        type: String,
        enum: ['fixed', 'hourly'],
        default: 'fixed'
    },
    budget: {
        type: Number,
        required: true,
        min: 10, 
    },
    deadline: {
        type: Date,
        required: true,
    },
    place:{
        type:String,
        required:true,
    },
    postedBy: {
        type: Schema.Types.ObjectId, // Links to the Client who posted the job
        ref: 'User',
        required: true,
    },
     isDeleted: {
    type: Boolean,
    default: false, 
  },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'], 
        default: 'open'
    },
    freelancerHired: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        default: null,
    },
    

    proposalsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);