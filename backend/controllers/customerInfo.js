const User = require('../models/customerInfo'); 

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
    let { name, email, mobile, password } = req.body;

}

module.exports = {
    getCustomerInfo,
};