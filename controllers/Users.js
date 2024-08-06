import db from "../config/Database.js";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import moment from "moment/moment.js";

export const registerUser = async (req, res) => {
  const t = await db.transaction();
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const qGetExist = await db.query(
      "SELECT username FROM tbl_user WHERE username = :username",
      {
        type: QueryTypes.SELECT,
        replacements: {
          username: username,
        },
      }
    );

    if (qGetExist.length > 0) throw "Username already exist";

    const qInsertData = await db.query(
      "INSERT INTO tbl_user (username, password, createTime) VALUES (:username, :password, :createTime)",
      {
        type: QueryTypes.INSERT,
        replacements: {
          username: username,
          password: hashPassword,
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    if (!qInsertData) throw "Failed register";

    await t.commit();
    res.status(200).json({ msg: "Success register" });
  } catch (error) {
    await t.rollback;
    res.status(500).json({ msg: "Failed register" });
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.query(
      "SELECT password FROM tbl_user WHERE username = :username",
      {
        type: QueryTypes.SELECT,
        replacements: {
          username: username,
        },
      }
    );
    const match = await bcrypt.compare(password, user[0].password);

    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    res.status(200).json({ msg: "Success login" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed login" });
  }
};

export const listUser = async (req, res) => {
  try {
    const qGetListUser = await db.query(
      "SELECT username, password, createtime FROM tbl_user ORDER BY createtime DESC",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!qGetListUser) throw "Failed get user";

    res.status(200).json(qGetListUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed get user" });
  }
};

export const detailUser = async (req, res) => {
  try {
    const username = req.query.username;

    console.log(username);
    const qGetDetail = await db.query(
      "SELECT username, password FROM tbl_user WHERE username = :username",
      {
        type: QueryTypes.SELECT,
        replacements: {
          username: username,
        },
      }
    );
    if (!qGetDetail) throw "Failed get user";
    res.status(200).json(qGetDetail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed get detail user" });
  }
};

export const addUser = async (req, res) => {
  const t = await db.transaction();
  try {
    const { username, password } = req.body;

    const qGetExist = await db.query(
      "SELECT username FROM tbl_user WHERE username = :username",
      {
        type: QueryTypes.SELECT,
        replacements: {
          username: username,
        },
      }
    );
    if (qGetExist.length > 0) {
      throw "Username already exist!";
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const qAddUser = await db.query(
      "INSERT INTO tbl_user (username, password, createtime) VALUES (:username, :password, :createtime)",
      {
        type: QueryTypes.INSERT,
        replacements: {
          username: username,
          password: hashPassword,
          createtime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );
    if (!qAddUser) throw "Failed add new user";

    res.status(200).json({ msg: "Success add new user" });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ msg: "Failed add user" });
  }
};

export const editUser = async (req, res) => {
  const t = await db.transaction();
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const qUpdateUser = await db.query(
      "UPDATE tbl_user SET password = :password, createtime = :createtime WHERE username =:username",
      {
        type: QueryTypes.UPDATE,
        replacements: {
          username: username,
          password: hashPassword,
          createtime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    if (!qUpdateUser) throw "Failed edit user";

    await t.commit();
    res.status(200).json({ msg: "Success edit user" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ msg: "Failed edit user" });
  }
};

export const deleteUser = async (req, res) => {
  const t = await db.transaction();
  try {
    const { username } = req.body;

    const qDeleteUser = await db.query(
      "DELETE FROM tbl_user WHERE username = :username",
      {
        type: QueryTypes.DELETE,
        replacements: {
          username: username,
        },
      }
    );

    res.status(200).json({ msg: "Success delete user" });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ msg: "Failed delete user" });
  }
};
