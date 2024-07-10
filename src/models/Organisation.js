import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const organisation = sequelize.define('Organisation', {
    orgId: {
        type: DataTypes.STRING,
        unique: true
    }, 
    name: {
        type: DataTypes.STRING,
        
        allowNull: false
    }, 
    description: {
        type: DataTypes.STRING,
    }, 
}, {timestamps: false});

// await organisation.sync();
// console.log("The Organisation model table was just created");

export default organisation;