import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll(
            {
                attributes: ['id', 'fullName', 'username', 'email', 'address', 'contactNumber', 'company']
            }
        );
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { fullName, username, email, address, contactNumber, company, password, confirmPassword } = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg: "Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // const usernameLoweredCase = username.toLowerCase();
    
    try {
        await Users.create({
            fullName: fullName,
            username: username,
            email: email,
            address: address, 
            contactNumber: contactNumber,
            company: company,
            password: hashPassword
        });
        res.json({msg: "Register Berhasil!"});
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                username: req.body.username
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg:"Wrong password!"});
        const userId = user[0].id; // id: nama field di db
        const fullName = user[0].fullName;
        const username = user[0].username;
        const email = user[0].email;
        const address = user[0].address;
        const contactNumber = user[0].contactNumber;
        const company = user[0].company;
        
        const accessToken = jwt.sign({userId, fullName, username, email, address, contactNumber, company}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, fullName, username, email, address, contactNumber, company}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update(
            {
                refresh_token: refreshToken
            },
            {
                where:{
                    id: userId
                }
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24*60*60*1000 // dlm milis
                // secure:true, // tdk perlu bila hanya di localhost
            });
            res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Username not found"})
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll(
        {
            where:{
                refresh_token: refreshToken
            }
        }
    );
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update(
        {
            refresh_token: null
        }, 
        {
            where:{
                id: userId
            }
        }
    );
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}