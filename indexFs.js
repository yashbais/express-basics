const express = require('express')
const users = require('./MOCK_DATA.json')
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


app.get('/users', (req, res) => {
    const html = `
    <ul>${users.map((ele) => `<li>${ele.first_name} ${ele.last_name}</li>`).join("")}</ul>`
    return res.send(html)
})

app.get('/api/users', (req, res) => {
    return res.json(users)
})

// app.post('/api/users', (req, res) => {
//     const body = req.body;
//     users.push({ id: users.length + 1, ...body })
//     fs.writeFile("MOCK_DATA.json", JSON.stringify(users), ((err, data) => {
//         return res.status(201).json({ status: "success", id: users.length })
//     }))
// })

app.post('/api/users', async (req, res) => {
    const body = req.body;
     const result = await User.create({...body})
     console.log(result , body,"this is dat")

     return res.status(201).json({ status: "success", id: 'random!' })
})

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find((single) => single.id === id)
        if (!user) return res.send("Data not found for " + id)
        return res.json(user)
    }).put((req, res) => {
        const id = Number(req.params.id)
        const body = req.body;
        const index = users.findIndex((single) => single.id === id)
        if (index == -1) return res.send("Data not found for " + id)
        users[index] = { ...users[index], ...body }
        fs.writeFile("MOCK_DATA.json", JSON.stringify(users), ((err, data) => {
            return res.json({ status: "success updated" })
        }))
    })
    .delete((req, res) => {
        const id = Number(req.params.id)
        const user = users.filter((single) => single.id !== id)
        fs.writeFile("MOCK_DATA.json", JSON.stringify(user), ((err, data) => {
            return res.json({ status: "success deleted" })
        }))
    })

app.listen(8000, () => console.log("server started"))