const ServiceRequest = require('../models/serviceRequest');
const ServiceCategory = require('../models/serviceCategory');
const CustomerInfo = require('../models/customerInfo');
const { addMinutes } = require('date-fns');
const { Op } = require('sequelize');
const ProviderInfo = require('../models/providerInfo');

// Create a new service request
const createServiceRequest = async (req, res) => {
  try {
    const { userId, role } = req;
    
    if (role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create service requests' });
    }
    
    const { serviceType, address, description, lat, lng } = req.body;
    
    if (!serviceType || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!isFinite(Number(lat)) || !isFinite(Number(lng)) || lat === null || lng === null || lat === '' || lng === '') {
      return res.status(400).json({ message: 'Please share your live location to request instant service' });
    }
    
    // Set expiration time to 30 minutes from now
    const expiresAt = addMinutes(new Date(), 30);
    
    const serviceRequest = await ServiceRequest.create({
      customer_id: userId,
      service_type_id: serviceType,
      // The live location is the service location; the text is just a label
      address: address && String(address).trim() ? address : `Live location (${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)})`,
      description,
      lat: Number(lat),
      lng: Number(lng),
      status: 'PENDING',
      created: new Date(),
      expires_at: expiresAt
    });
    
    res.status(201).json({
      message: 'Service request created successfully',
      id: serviceRequest.id,
      expiresAt
    });
    
  } catch (err) {
    console.error('Error creating service request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service requests for a customer
const getCustomerServiceRequests = async (req, res) => {
  try {
    const { userId, role } = req;
    
    if (role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const serviceRequests = await ServiceRequest.findAll({
      where: { customer_id: userId },
      include: [
        {
          model: ServiceCategory,
          as: 'serviceType',
          attributes: ['id', 'name']
        }
      ],
      order: [['created', 'DESC']]
    });
    
    res.status(200).json(serviceRequests);
    
  } catch (err) {
    console.error('Error fetching service requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get active service requests for providers
const getActiveServiceRequests = async (req, res) => {
  try {
    const { userId, role } = req;
    
    if (role !== 'provider') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const provider = await ProviderInfo.findOne({where: { id: userId }});
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const services = await provider.getServices();
    const now = new Date();
    
    const serviceRequests = await ServiceRequest.findAll({
      where: {
        status: 'PENDING',
        service_type_id: services.filter(s => s.is_active !== false && s.instant_enabled !== false).map(s => s.category_id),
        expires_at: {
          [Op.gt]: now
        }
      },
      include: [
        {
          model: ServiceCategory,
          as: 'serviceType',
          attributes: ['id', 'name']
        },
        {
          model: CustomerInfo,
          attributes: ['id', 'name']
        }
      ],
      order: [['created', 'DESC']]
    });
    
    res.status(200).json(serviceRequests);
    
  } catch (err) {
    console.error('Error fetching active service requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update service request status
const updateServiceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId, role } = req;
    
    if (!['ACCEPTED', 'DECLINED', 'EXPIRED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const serviceRequest = await ServiceRequest.findByPk(id);
    
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    
    // Only the customer who created the request can update it
    if (role === 'customer' && serviceRequest.customer_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await serviceRequest.update({ status });
    
    res.status(200).json({
      message: 'Service request updated successfully',
      status
    });
    
  } catch (err) {
    console.error('Error updating service request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createServiceRequest,
  getCustomerServiceRequests,
  getActiveServiceRequests,
  updateServiceRequestStatus
};