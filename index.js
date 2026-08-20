const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const app = express()


// ==================== DATABASE CONNECTION ====================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err))

const db = mongoose.connection

db.on("connected", () => {
    console.log("MongoDB connection established")
})

db.on("error", (error) => {
    console.error("MongoDB connection error:", error)
})

db.on("disconnected", () => {
    console.log("MongoDB disconnected")
})

app.use(express.json())

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

const userCtrl = require("./controllers/userControl.js")
app.get("/api/users", userCtrl.index)
app.get("/api/users/:id", userCtrl.show)
app.post("/api/users", userCtrl.create)
app.put("/api/users/:id", userCtrl.update)
app.delete("/api/users/:id", userCtrl.remove)




app.listen(8000, () => {
    console.log('Server is running on port 8000')
})