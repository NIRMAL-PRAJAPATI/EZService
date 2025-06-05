const { Op, or } = require('sequelize');
const User = require('../models/customerInfo');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getCustomerInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching customer info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const loginCustomer = async (req, res) => {
    let { mobile, password } = req.body;

    try {
        const existanceCheck = await User.findOne({
            where: { [Op.or]: [{ mobile: mobile }, { email: mobile }] }
        })

        if (!existanceCheck) {
            res.status(404).json({ message: "entered email/mobile is not exist !" });
        } else {
            try {
                const passwordCheck = await existanceCheck.validPassword(password);

                if (!passwordCheck) {
                    res.status(401).json({ message: "Incorrect password !" })
                }
                let userData = await existanceCheck.toJSON();

                delete userData.id;
                delete userData.password;
                console.log('JWT_SECRET:', `"${process.env.JWT_SECRET}"`, typeof process.env.JWT_SECRET);


                const token = jwt.sign({ id: existanceCheck.id, role: 'customer'}, process.env.JWT_SECRET, { expiresIn: '1h' });

                console.log("success", token, userData)
                res.status(200).json({ data: userData, token, message: "success" });
            } catch (error) {
                res.status(500).json({ message: "problem in password varification" })
            }
        }
    } catch (error) {
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}

async function registerCustomer(req, res) {
    let { name, email, mobile, pincode, city, state, country, password } = await req.body;

    try {
        const existanceCheck = await User.findOne({
            where: { mobile }
        });

        if (existanceCheck) {
            return res.status(409).json({
                errorMessage: "Mobile number already registered",
            });
        }
        await User.create({
            name, email, mobile, password, pincode, city, state, country
        });

        res.status(201).json({
            message: "Registration successful",
            data: { name, email, mobile, pincode, city, state, country }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}


const varifyEmailMobile = async (req, res) => {
    let { name, email, mobile, pincode, city, state, country, password } = req.body;

    try {
        const existanceCheck = await User.findOne({
            where: { [Op.or]: [{ email }, { mobile }] }
        });

        if (existanceCheck) {
            return res.status(409).json({
                errorMessage: "email or mobile is already registered",
                data: { name, email, mobile, pincode, city, state, country, password }
            });
        }
        res.status(201).json({ message: "Registration successfull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}

module.exports = {
    getCustomerInfo, registerCustomer, varifyEmailMobile, loginCustomer
};