const user = require("../models/user.js")


const index = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const users = await user.paginate({}, { page, limit })
        if(!users || users.docs.length === 0){
            return res.status(404).json({ success: false, message: "No users found" })
        }
        res.status(200).json({ success: true, data: users })
    } catch (error) {
        next(error)
    }
}

const show = async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await user.findById(id)
        if(!response){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User found", data: response })
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const {firstName, lastName, email, phone} = req.body

        const emailExists = await user.findOne({ email: email?.toLowerCase() })
        if (emailExists) {
            return res.status(400).json({ success: false, message: "A user with this email already exists" })
        }

        const phoneExists = await user.findOne({ phone })
        if (phoneExists) {
            return res.status(400).json({ success: false, message: "A user with this phone number already exists" })
        }

        const response = await user.create({firstName, lastName, email, phone})
        res.status(201).json({ success: true, message: "User created successfully", data: response })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const {id} = req.params
        
        // Check if email is being changed and if it already exists
        if (req.body.email) {
            const existing = await user.findOne({ 
                email: req.body.email.toLowerCase(),
                _id: { $ne: id }
            })
            if (existing) {
                return res.status(400).json({ success: false, message: "Email already in use by another user" })
            }
            req.body.email = req.body.email.toLowerCase()
        }
        
        const response = await user.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if(!response){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User updated successfully", data: response })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const {id} = req.params
        
        const item = await user.findByIdAndDelete(id)
        if(!item){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, message: "User deleted successfully" })
    } catch (error) {
        next(error)
    }
}


module.exports = {

    index,
    show,
    create,
    update,
    remove,

}