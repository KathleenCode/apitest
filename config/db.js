import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    host: 'localhost',
    port: 9000,
    logging: false, // Disable logging (useful in production)
});

try {
    sequelize.authenticate();
    console.log("connection established with mysql");
} catch(error) {
    console.log("mysql connection failed", error);
}

export default sequelize;

