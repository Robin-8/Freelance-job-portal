import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "senderModel"
    },
    senderModel: {
        type: String,
        required: true,
        enum: ["Client", "Freelancer", "Admin"]
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverModel"
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ["Client", "Freelancer", "Admin"]
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
