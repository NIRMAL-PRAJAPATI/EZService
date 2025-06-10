const { Op, or, where } = require('sequelize');
const User = require('../models/customerInfo');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getCustomerInfo = async (req, res) => {
    try {
        const customerId = req.userId;
        const customerRole = req.role;

        if (customerRole !== 'customer') {
            return res.status(403).json({ message: "Access denied" })
        }

        if (!customerId) {
            return res.status(400).json({ message: "You are not a legetimate user" });
        }

        const user = await User.findByPk(customerId);
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


                const token = jwt.sign({ id: existanceCheck.id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

const updateCustomer = async (req, res) => {
    const { name, city, state, country } = req.body;
    try {
        const updateDetails = await User.update(
            { name, city, state, country },
            { where: { id: req.userId } }
        );

        if (!updateDetails) { res.status(404).json({ message: "user not found" }) }

        res.status(200).json({ message: "user data updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const customer = await User.findByPk(req.userId);
        console.log(currentPassword, newPassword);

        if (!customer) { console.log("not found"); return res.status(404).json({ message: "user not found" }) };

        const isMatch = await bcrypt.compare(currentPassword, customer.password);
        console.log(isMatch);

        if (!isMatch) {
            console.log("not match")
            return res.status(400).json({ message: "password is incorrect !" });
        }

        await customer.update({ password: newPassword });
        res.status(200).json({ message: "" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.userId }
        });

        if (deleted === 0) {
            res.status(404).json({message: "Customer not found !"})
        } else {
            res.status(200).json({message: "Customer deleted successfully"});
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = {
    getCustomerInfo, registerCustomer, varifyEmailMobile, loginCustomer, updateCustomer, updatePassword, deleteCustomer
};