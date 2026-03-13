const transactionModel = require("../modal/transactional.model")
const accountModel = require("../modal/account.modal")


async function createAccount(req, res) {
    const {user} = req
    const account = await accountModel.create({
        user:user._id
    })
    res.status(201).json({
        account
    })
}
async function getAccounts(req, res) {
    const {user} = req
    const accounts = await accountModel.find({
        user:user._id
    })
    res.status(200).json({
        accounts
    })
}
async function getBalance(req, res) {
    const {user} = req
    const {accountId} = req.params
    const account = await accountModel.findOne({
        _id:accountId,
        user:user._id
    })
    if(!account){
        return res.status(404).json({
            message:"account not found"
        })
    }
    const balance = await account.getBalancedata()
    res.status(200).json({
        balance: balance,
        accountId: account._id
    })
}
async function closeAccount(req, res){
    const {user} = req
    const {accountId} = req.params
    const account = await accountModel.findOne({
        _id:accountId,
        user:user._id
    })
    if(!account){
        return res.status(404).json({
            message:"account not found"
        })
    }
    const balance = await account.getBalancedata()
    if(balance !== 0){
        return res.status(400).json({
            message:"Cannot delete account with non‑zero balance"
        })
    }
    account.status = "closed"
    await account.save()
    return res.status(200).json({
        message:"Account closed",
        accountId: account._id
    })
}
module.exports = {
    createAccount,
    getAccounts,
    getBalance,
    closeAccount
}
