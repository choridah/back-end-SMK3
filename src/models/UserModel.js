import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users',
    {
        fullName:{
            type:DataTypes.STRING
        },
        username:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        address:{
            type:DataTypes.STRING
        },
        contactNumber:{
            type:DataTypes.STRING
        },
        company:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING
        },
        refresh_token:{
            type:DataTypes.TEXT
        }
    },
    {
        freezeTableName:true
    }
);

export default Users;