const express = require("express");
const router = express.Router();
const { register, externalSourceSignUp } = require("../controllers/auth/registerController");
const { login, signInExternalSource } = require("../controllers/auth/loginController");
const { changePassword } = require("../controllers/auth/changePassword");
const { updateUser } = require("../controllers/auth/updateUser");
const { deleteUser } = require("../controllers/auth/deleteUser");


//register new user
router.post("/register", register);
// router.post("/ExternalSourceSignUp", externalSourceSignUp);


//login user
router.post("/login", login)
// router.post("/ExternalSourceLogin", signInExternalSource)


//updateUser
router.post("/updateUser", updateUser)

//changePassword
router.patch("/changePassword", changePassword)

//DeleteUser
router.delete("/deleteUser", deleteUser)




module.exports = router;
