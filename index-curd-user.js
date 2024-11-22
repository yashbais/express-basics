const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const { type } = require('os')
const { timeStamp } = require('console')
const app = express()

// middleware
app.use(express.urlencoded({ extended: false }))

mongoose.connect("mongodb://127.0.0.1:27017/user")
.then(()=>console.log("Mongodb connected")).catch((err)=>
console.log("mongodb not connected",err))

const userSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    
    gender:{
        type:String,
    },
    job_title:{
        type:String,
        required:true
    }
},{timeStamp:true})

const User = mongoose.model('user',userSchema)

app.use((req,res,next)=>{
    fs.appendFile('log.txt',`ip-address: ${req.ip} ,Date ${Date.now()}: ${req.method}: ${req.path}  \n`,((err,data)=>{
        next()
    }))
})


app.get('/users', async(req, res) => {
    const allDbUsers = await User.find({})
    const html = `
    <ul>${allDbUsers.map((ele) => `<li>${ele.first_name} ${ele.last_name}</li>`).join("")}</ul>`
    return res.send(html)
})

app.get('/api/users', async (req, res) => {
    const allDbUsers = await User.find({})
    return res.json(allDbUsers)
})


app.post('/api/users', async (req, res) => {
    const body = req.body;
     const result = await User.create({...body})
     console.log(result , body,"this is dat")

     return res.status(201).json({ status: "success", id: 'random!' })
})

app.route('/api/users/:id')
    .get(async(req, res) => {
        const user = await User.findById(req.params.id)
        if (!user) return res.send("Data not found for " + req.params.id)
        return res.json(user)
    })
    .patch(async(req, res) => {
        const id = req.params.id
        const body = req.body;
        const user = await User.findByIdAndUpdate(id, {...body})
        return res.status(201).json({status: "success updated"})
    })
    .delete(async(req, res) => {
        const id = req.params.id
        const deletedUser = await User.findByIdAndDelete(id)
        return res.json({ status: "success deleted" })
    })

app.listen(8000, () => console.log("server started"))