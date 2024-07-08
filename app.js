import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import UserRoutes from "./routes/User.js";
import User from "./models/User.js";
import Organisation from "./models/Organisation.js";

dotenv.config();

const PORT = process.env.PORT || 9005;

const app = express();

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, { through: 'UserOrganisation' });

await sequelize.sync();
console.log("All tables have been created");

app.use(express.json());

app.use("/", UserRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));