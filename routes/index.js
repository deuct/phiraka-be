import express from "express";
import {
  addUser,
  deleteUser,
  detailUser,
  editUser,
  listUser,
  loginUser,
  registerUser,
} from "../controllers/Users.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/list", listUser);
router.get("/user/detail", detailUser);
router.post("/user/add", addUser);
router.post("/user/edit", editUser);
router.post("/user/delete", deleteUser);

export default router;
