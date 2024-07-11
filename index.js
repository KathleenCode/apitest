import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import UserRoutes from "./routes/User.js";
import User from "./models/User.js";
import Organisation from "./models/Organisation.js";
import db from './config/config.json'  assert { type: "json" }

dotenv.config();

const PORT = process.env.PORT || 9005;

const app = express();

app.use(express.json());

app.use(UserRoutes);
app.get("/", async(req, res) => {
    res.send("app starts");
})

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, { through: 'UserOrganisation' });


await sequelize.sync().then(() => {

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)

    });
}).then(() => 
    console.log("All tables have been created")
).catch((error) =>
    console.log(error)
)
