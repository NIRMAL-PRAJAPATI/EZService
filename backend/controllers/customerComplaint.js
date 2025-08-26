const CustomerComplaint = require("../models/customerComplaint");
const CustomerInfo = require("../models/customerInfo");
const ProviderInfo = require("../models/providerInfo");
const Service = require("../models/service");

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

module.exports = {
    getProviderComplaints,
    updateComplaintStatus
};