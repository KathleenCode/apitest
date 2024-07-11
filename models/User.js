import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import Organisation from "./Organisation.js";

// const sequelize = new Sequelize("mysql");

const User = sequelize.define("User", {
    userId: {
        type: DataTypes.STRING,
        // autoIncrement: true,
        primaryKey: true,
        unique: true,
        validate: {
            min: 0 // Price must be a non-negative decimal number
          }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 30] // Username must be between 3 and 30 characters long
          }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 30] // Username must be between 3 and 30 characters long
          }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
          }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 10] // Username must be between 3 and 30 characters long
          }
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 10] // Username must be between 3 and 30 characters long
          }
    }
},{
    hooks: {
      beforeCreate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    },
},
// {freezeTableName: true} 
// {tableName: "newTableName"}
{timestamps: false}
);

User.afterCreate(async (user) => {
    // Create organisation for the user
    try {
      await Organisation.create({
        name: `${user.firstName}'s Organisation`,
        orgId: user.id,
        description: `Organisation for ${user.firstName} ${user.lastName}`
      });
    } catch (error) {
      console.error('Error creating organisation:', error);
    }})

await User.sync();

console.log("The table for the user model was (re)created");

export default User