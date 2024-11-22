const express = require('express')
const { connectMongoDb } = require('./connection')

const { logReqRes } = require('./middlewares')
const userRouter = require('./routes/user')

const app = express()
const PORT =8000

connectMongoDb("mongodb://127.0.0.1:27017/user").then(() => {
    console.log("Mongodb connected")
}).catch((err) => {
    console.log("err", err)
})

app.use(express.urlencoded({ extended: false }))

app.use(logReqRes('log.txt'))

app.use("/api/users", userRouter)

app.listen(PORT, () => console.log("server started"))

