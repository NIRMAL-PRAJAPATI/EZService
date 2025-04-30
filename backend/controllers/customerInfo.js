const { Op, or } = require('sequelize');
const User = require('../models/customerInfo'); 
const bcrypt = require('bcrypt');

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

const registerCustomer = async (req, res) => {
    let { name, email, mobile, pincode, city, state, country, password } = req.body;
    
    try {
        const existanceCheck = await User.findOne({
            where: {mobile}
        });

        if(existanceCheck) {
            return res.status(409).json({
                errorMessage: "mobile number already varified",
            });
    }
            
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({name, email, mobile, password: hashedPassword});
    res.status(201).json({message: "Registration successfull",
        data: { name, email, mobile, pincode, city, state, country, password }
    });
 } catch(error) {
        res.status(500).json({errorMessage: "Internal Server Error"});
    }
}

const varifyEmailMobile = async (req, res) => {
    let { name, email, mobile, pincode, city, state, country, password } = req.body;

    try {
        const existanceCheck = await User.findOne({
            where: {[Op.or]: [{email}, {mobile}]}
        });

        if(existanceCheck) {
            return res.status(409).json({
                errorMessage: "email or mobile is already registered",
                data: { name, email, mobile, pincode, city, state, country, password }
            });
        }
        res.status(201).json({message: "Registration successfull"});
    } catch(error) {
        console.log(error);
        res.status(500).json({errorMessage: "Internal Server Error"});
    }
}

module.exports = {
    getCustomerInfo, registerCustomer, varifyEmailMobile
};