const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  countOfAll,
} = require("../controllers/userController");

const router = express.Router();

router.get("/count-of-all", countOfAll); 
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login)


module.exports = router;
