const userModel = require("../modal/user.modal")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.services")
const tokenBlackListModel = require("../modal/blacklist.modal")

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "name, email and password are required",
            status: "failed"
        })
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase()
        const isExists = await userModel.findOne({ email: normalizedEmail })

        if (isExists) {
            return res.status(422).json({
                message: "User already exists with this email. Please login instead.",
                status: "failed"
            })
        }

        const user = await userModel.create({
            email: normalizedEmail,
            password,
            name: String(name).trim()
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

        res.cookie("token", token)

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })

        if (emailService.sendRegistrationemail) {
          try { await emailService.sendRegistrationemail(user.email, user.name) } catch {}
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(422).json({
                message: "User already exists with this email. Please login instead.",
                status: "failed"
            })
        }

        if (error?.name === "ValidationError") {
            const firstMessage = Object.values(error.errors || {})[0]?.message
            return res.status(400).json({
                message: firstMessage || "Please provide valid registration details.",
                status: "failed"
            })
        }

        return res.status(500).json({
            message: "Registration failed due to server error. Please try again.",
            status: "failed"
        })
    }
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */

async function userLoginController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
  
}
