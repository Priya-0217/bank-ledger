const{Router} = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controller/transactional.controller")

const transactionRoutes = Router()

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)
transactionRoutes.post("/system/initial_funds",authMiddleware.systemAuthMiddleware,transactionController.createinitialFunds)

module.exports = transactionRoutes

 