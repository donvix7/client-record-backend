
const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")
const { v4: uuidv4 } = require('uuid')

const userSchema = new mongoose.Schema({

    _id: {
        type: String,
        default: () => uuidv4()
    },
  
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"]
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\d+$/, "Invalid phone number"]
    },
    company: {
        type: String,
        default: "unknown",
        trim: true
    },
    job: {
        type: String,
        default: "unknown",
        trim: true
    },
    status:{
        type: String,
        enum: ["active", "inactive", "pending"],
        default: "pending"
    }
}, {timestamps: true})

userSchema.plugin(paginate)

// Delete cached model to ensure plugin is always applied (important for nodemon hot-reloads)
delete mongoose.models["User"]
module.exports = mongoose.model("User", userSchema)