import {Sequelize} from "sequelize";

const db = new Sequelize('smk3-app_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;