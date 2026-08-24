const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const app = express()

// ==================== DATABASE CONNECTION ====================

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
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

// ==================== MIDDLEWARE ====================

app.use(express.json())

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'http://localhost:3001',
        'https://client-records-uun2.vercel.app',
        'http://localhost:3000'
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// ==================== ROUTES ====================

const userCtrl = require("./controllers/userControl.js")
app.get("/api/users", userCtrl.index)
app.get("/api/users/:id", userCtrl.show)
app.post("/api/users", userCtrl.create)
app.put("/api/users/:id", userCtrl.update)
app.delete("/api/users/:id", userCtrl.remove)

// ==================== ERROR HANDLING ====================

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Something went wrong!" })
})

// ==================== SERVER ====================

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})