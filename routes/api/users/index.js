const express = require("express");
const router = express.Router();
const userController = require("./controller");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const { token } = req.headers;
  jwt.verify(token, "XEDIKE", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token invalid" });
    if (decoded) return next();
  });
};

router.get("/", userController.getUser);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", authenticate, userController.updateUserById);
router.delete("/:id", userController.deleteUserById);
router.post("/login", userController.login);
module.exports = router;
