const CustomerComplaint = require("../models/customerComplaint");
const CustomerInfo = require("../models/customerInfo");
const ProviderInfo = require("../models/providerInfo");
const Service = require("../models/service");
const Order = require("../models/order");

const getProviderComplaints = async (req, res) => {
    try {
        const { userId, role } = req;
        const { limit, page, offset } = req.pagination;
        
        if (role !== 'provider') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Set up associations
        CustomerComplaint.belongsTo(CustomerInfo, {
            foreignKey: 'customer_id',
            targetKey: 'id'
        });
        CustomerComplaint.belongsTo(Service, {
            foreignKey: 'service_id',
            targetKey: 'id'
        });
        
        const complaints = await CustomerComplaint.findAll({
            where: { provider_id: userId },
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: CustomerInfo,
                    attributes: ['name', 'email', 'mobile', 'id'],
                },
                {
                    model: Service,
                    attributes: ['name', 'id'],
                }
            ],
        });

        res.status(200).json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { status } = req.body;
        const { userId, role } = req;
        
        if (role !== 'provider') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const validStatuses = ['IN_PROGRESS', 'RESOLVED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        const complaint = await CustomerComplaint.findOne({
            where: { 
                id: complaintId,
                provider_id: userId
            }
        });
        
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        
        await complaint.update({ status });
        
        res.status(200).json({ 
            message: "Complaint status updated successfully",
            complaint
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Customer files a complaint about one of their own bookings.
const createComplaint = async (req, res) => {
    try {
        const { userId, role } = req;
        if (role !== 'customer') {
            return res.status(403).json({ message: "Only customers can file complaints" });
        }

        const { order_id, subject, issue } = req.body;
        if (!order_id || !subject || !issue || issue.trim().length < 10) {
            return res.status(400).json({ message: "Please choose a booking, a reason and describe the issue (at least 10 characters)." });
        }

        const order = await Order.findOne({ where: { order_id, customer_id: userId } });
        if (!order) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const complaint = await CustomerComplaint.create({
            customer_id: userId,
            provider_id: order.provider_id,
            service_id: order.service_id,
            subject: subject.trim(),
            issue: issue.trim(),
            created: new Date(),
            status: 'OPEN'
        });

        res.status(201).json(complaint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getCustomerComplaints = async (req, res) => {
    try {
        const { userId, role } = req;
        if (role !== 'customer') {
            return res.status(403).json({ message: "Access denied" });
        }

        CustomerComplaint.belongsTo(Service, { foreignKey: 'service_id', targetKey: 'id' });
        CustomerComplaint.belongsTo(ProviderInfo, { foreignKey: 'provider_id', targetKey: 'id' });

        const complaints = await CustomerComplaint.findAll({
            where: { customer_id: userId },
            order: [['created', 'DESC']],
            include: [
                { model: Service, attributes: ['name', 'id'] },
                { model: ProviderInfo, attributes: ['name', 'id'] }
            ]
        });

        res.status(200).json(complaints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getProviderComplaints,
    updateComplaintStatus,
    createComplaint,
    getCustomerComplaints
};