const express = require("express");
const router = express.Router();
const { register, externalSourceSignUp } = require("../controllers/auth/registerController");
const { login, signInExternalSource } = require("../controllers/auth/loginController");
const { changePassword } = require("../controllers/auth/changePassword");
const { updateUser } = require("../controllers/auth/updateUser");
const { deleteUser } = require("../controllers/auth/deleteUser");
const { forgotPassword } = require("../controllers/auth/forgetPassword");
const { resetPassword } = require("../controllers/auth/resetPassword");


//register new user
router.post("/register", register);


//login user
router.post("/login", login)

//updateUser
router.post("/updateUser", updateUser)

//changePassword
router.patch("/changePassword", changePassword)

//forgotPassword
router.post("/forgotPassword", forgotPassword)

//resetPassword
router.patch("/resetPassword", resetPassword)

//DeleteUser
router.delete("/deleteUser", deleteUser)




module.exports = router;
