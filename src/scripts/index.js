import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "../config/Database.js";
import router from "../routes/UserRoutes.js";
import Users from "../models/UserModel.js"; // CARA 1: Membuat Tabel users dengan sequelize
dotenv.config();
const app = express();

try{
    await db.authenticate();
    console.log('Database Connected ...');
    await Users.sync(); //
} catch(error) {
    console.error(error);
}

app.use(
    cors(
        { 
            credentials: true, 
            origin: 'http://localhost:3000' 
        }
    )
);

app.use(
    cors({
        credentials:true, 
        origin:'http://localhost:3000'
    })
);
app.use(cookieParser()); // mengambil value from cookie
app.use(express.json()); // save format json
app.use(router); // sebagai middleware

app.listen(5000, () => console.log('Server running at port 5000'));
