const CustomerInfo = require("../models/customerInfo");
const Order = require("../models/order");
const ProviderInfo = require("../models/providerInfo");
const Service = require("../models/service");

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit, page, offset } = req.pagination;
        const order = await Order.findByPk(id, 
            {
                limit: limit,
                offset: offset,
                order: [['created', 'DESC']],
                include: [
                    {
                        model: Service,
                        attributes: ['name', 'cover_image', 'visiting_charge', 'description','instant_visiting_charge','id'],
                    },
                    {
                        model: CustomerInfo,
                        attributes: ['name', 'email', 'mobile','id'],
                    },
                    {
                        model: ProviderInfo,
                        attributes: ['name', 'email', 'mobile','id','address'],
                    }
                ],
            }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getAllOrders = async (req, res) => {
    try {
        const { limit, page, offset } = req.pagination;
        const orders = await Order.findAll({
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: Service,
                    attributes: ['name', 'cover_image', 'visiting_charge', 'description','instant_visiting_charge','id'],
                },
                {
                    model: CustomerInfo,
                    attributes: ['name', 'email', 'mobile','id'],
                },
                {
                    model: ProviderInfo,
                    attributes: ['name', 'email', 'mobile','id','address'],
                }
            ],
        });

        if (!orders) {
            return res.status(404).json({ message: "Orders not found" });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOrdersByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit, page, offset } = req.pagination;
        const orders = await Order.findAll({
            where: { customer_id: id },
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: Service,
                    attributes: ['name', 'cover_image', 'visiting_charge', 'instant_visiting_charge','id'],
                },
                {
                    model: ProviderInfo,
                    attributes: ['name','id'],
                }
            ],
        });

        if (!orders) {
            return res.status(404).json({ message: "Orders not found" });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    getOrderById,
    getAllOrders,
    getOrdersByUserId
}