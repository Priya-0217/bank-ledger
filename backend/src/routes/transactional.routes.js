const express = require("express")
const { authMiddleware, systemAuthMiddleware } = require("../middleware/auth.middleware")
const transactionalController = require("../controller/transactional.controller")

const router = express.Router()

router.post("/", authMiddleware, transactionalController.createTransaction)
router.post("/initial-funds", systemAuthMiddleware, transactionalController.createinitialFunds)
// Backward-compatible aliases
router.post("/system/initial_funds", systemAuthMiddleware, transactionalController.createinitialFunds)
router.post("/system/initial-funds", systemAuthMiddleware, transactionalController.createinitialFunds)
router.get("/history", authMiddleware, transactionalController.getUserTransactions)

module.exports = router
