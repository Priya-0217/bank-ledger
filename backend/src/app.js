const express = require('express');
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionalRouter = require("./routes/transactional.routes")

const app = express(); 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/",(req,res) =>{
    res.send("ledger service is up")
})
app.use("/api/auth",authRouter)
app.use("/api/account",accountRouter)   
app.use("/api/transaction",transactionalRouter)



module.exports = app;
