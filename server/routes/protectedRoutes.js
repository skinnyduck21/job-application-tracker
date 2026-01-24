const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/private", authMiddleware, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
