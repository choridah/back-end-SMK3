import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll(
            {
                where:{
                    refresh_token: refreshToken
                }
            }
        );
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const fullName = user[0].fullName;
            const email = user[0].email;
            const address = user[0].address;
            const contactNumber = user[0].contactNumber;
            const company = user[0].company;
            const accessToken = jwt.sign({userId, name, email, address, contactNumber, company}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({ accessToken });
        })
    } catch (error) {
        console.log(error);
    }
}