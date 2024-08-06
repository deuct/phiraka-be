import { Sequelize } from "sequelize";

// const urlDB = `mysql://${MYSQLUSER}:${MYSQLPASSWORD}@${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}`;

const db = new Sequelize("db_phiraka", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  define: {
    timestamps: false,
  },
});

export default db;
