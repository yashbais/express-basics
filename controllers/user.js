const User = require('../models/user')

async function handleGetAllUsers(req, res) {
    const allDbUsers = await User.find({})
    return res.json(allDbUsers)
}

async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id)
    if (!user) return res.send("Data not found for " + req.params.id)
    return res.json(user)
}

async function handleDeleteUserById(req, res) {
    const id = req.params.id
    const deletedUser = await User.findByIdAndDelete(id)
    return res.json({ status: "success deleted" })
}

async function handleUpdateUserById(req, res) {
    const id = req.params.id
    const body = req.body;
    const user = await User.findByIdAndUpdate(id, { ...body })
    return res.status(201).json({ status: "success updated" })
}

async function handleCreateUser(req, res) {
    const body = req.body;
    const result = await User.create({ ...body })
    console.log(result, body, "this is dat")

    return res.status(201).json({ status: "success", id: 'random!' })
}




module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserById,
    handleCreateUser
}