const express = require("express")
const accountController = require("../controller/account.controller")
const { authMiddleware } = require("../middleware/auth.middleware")


const router = express.Router()


router.post("/",authMiddleware,accountController.createAccount)

router.get("/",authMiddleware,accountController.getAccounts)

router.get("/balance/:accountId",authMiddleware,accountController.getBalance)

module.exports = router