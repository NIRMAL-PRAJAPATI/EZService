const Provider = require('../models/providerInfo')
const services = require('../models/service')
const provider_bank = require("../models/providerBank");
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const ServiceReview = require('../models/serviceReview');
const CustomerComplaint = require('../models/customerComplaint');
const { Op, literal } = require('sequelize');
const sequelize = require('../db');
const CustomerInfo = require('../models/customerInfo');
const Service = require('../models/service');
const ServiceCategory = require('../models/serviceCategory');

const getProviderProfile = async (req, res) => {
    try{
        const providerId = req.userId;
        const role = req.role;
        if (role !== 'provider') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const provider = await Provider.findByPk(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    }catch(e){
        console.error('Error fetching provider info:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProviderBank = async (req, res) => {
    console.log("runnnnn");
    try{
        const providerId = req.userId;
        const role = req.role;
        if (role !== 'provider') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const provider = await provider_bank.findByPk(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    }catch(e){
        console.error('Error fetching provider info:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProviderWithServices = async (req, res)=>{
    try{
        const providerId = req.userId;
        const role = req.role;
        if (role !== 'provider') {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const provider = await Provider.findByPk(providerId, {
            include: [
                {
                    model: services,
                    as: 'services'
                }
            ]
        });
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    }catch(e){
        console.error('Error fetching provider with services:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProviderServices = async (req, res)=>{
    try{
        const providerId = req.userId;
        const role = req.role;
        if (role !== 'provider') {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const services = await Service.findAll({
            where: { provider_id: providerId },
            order: [['created', 'DESC']],
            include: [
                {
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['name','id'],
                }
            ]
        });
        if (!services) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(services);
    }catch(e){
        console.error('Error fetching provider with services:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProviderStats = async (req, res) => {
  try {
    const providerId = req.userId;
    const role = req.role;
    if (role !== 'provider') {
        return res.status(403).json({ message: 'Access denied' });
    }
    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }

    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Get current date for calculations
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [totalServices, ratingStats, totalOrders, pendingOrders, completedOrders, confirmedOrders, totalEarnings, lastMonthOrders, currentMonthOrders, latestReview] = await Promise.all([
      services.count({ where: { provider_id: providerId } }),
      ServiceReview.findOne({
        where: { provider_id: providerId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
        ]
      }),
      Order.count({ where: { provider_id: providerId } }),
      Order.count({ where: { provider_id: providerId, status: 'PENDING' } }),
      Order.count({ where: { provider_id: providerId, status: 'COMPLETED' } }),
      Order.count({ where: { provider_id: providerId, status: 'CONFIRMED' } }),
      Order.sum('estimated_charge', {
        where: {
          provider_id: providerId,
          status: 'COMPLETED',
          created: {
            [Op.gte]: currentMonth
          }
        }
      }),
      Order.count({ 
        where: { 
          provider_id: providerId,
          created: {
            [Op.gte]: lastMonth,
            [Op.lt]: currentMonth
          }
        }
      }),
      Order.count({ 
        where: { 
          provider_id: providerId,
          created: {
            [Op.gte]: currentMonth
          }
        }
      }),
      ServiceReview.findOne({
        where: { provider_id: providerId },
        include: [
            {
                model: CustomerInfo,
                attributes: ['name', 'email'],
            },
            {
                model: Service,
                attributes: ['name'],
            }
        ],
        attributes: ['rating', 'created', 'comment'],
        order: [['created', 'DESC']],
        limit: 1
      })
    ]);

    const averageRating = ratingStats?.getDataValue('averageRating') || 0;
    const totalReviews = ratingStats?.getDataValue('totalReviews') || 0;
    const customer_satisfaction = averageRating > 0 ? (averageRating / 5) * 5 : 0;

    res.status(200).json({
      totalServices,
      totalEarnings: totalEarnings || 0,
      completedOrders,
      pendingOrders,
      confirmedOrders,
      averageRating: parseFloat(averageRating).toFixed(1),
      totalReviews,
      totalOrders,
      lastMonthOrders,
      currentMonthOrders,
      customer_satisfation: parseFloat(customer_satisfaction).toFixed(1),
      latestReview: latestReview ? {
        comment: Array.isArray(latestReview.comment) ? latestReview.comment.join(", ") : latestReview.comment || '',
        rating: latestReview.rating,
        created: new Date(latestReview.created).toLocaleDateString(),
        customerName: latestReview.CustomerInfo?.name || 'Customer',
        serviceName: latestReview.Service?.name || 'Service'
      } : {
        comment: '',
        rating: 0,
        created: '',
        customerName: '',
        serviceName: ''
      }
    });
  } catch (e) {
    console.error('Error fetching provider stats:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const registerProvider = async (req, res)=>{
    try{
        const { name, email, mobile, password, address, city, state, country } = req.body;
        if (!name || !email || !mobile || !password ) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingProvider = await Provider.findOne({ where: {
            [Op.or]: [
                { email: email },
                { mobile: mobile }
            ]
        } });
        if (existingProvider) {
            return res.status(409).json({ message: 'Provider already exists' });
        }

        const newProvider = await Provider.create({ name, email, mobile, password, address, city, state, country });
        res.status(201).json(newProvider);

    }catch(e){
        console.error('Error registering provider:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const loginProvider = async (req,res)=>{
    try{

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const provider = await Provider.findOne({ where: { email } });
        if (!provider) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await provider.validPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const providerData = provider.toJSON();
        delete providerData.password;
        delete providerData.id;
        const token = jwt.sign({ id: provider.id, role: 'provider'}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({provider:providerData ,token});
    }catch(e){
        console.error('Error logging in provider:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getProviderOrders = async (req,res)=>{
    try{
        const providerId = req.userId;
        const role = req.role;
        if (role !== 'provider') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }

        const { limit, page, offset } = req.pagination;
        const orders = await Order.findAndCountAll({
            where: { provider_id: providerId },
            limit,
            offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: CustomerInfo,
                    attributes: ['name', 'email'],
                },
                {
                    model: Service,
                    attributes: ['name'],
                }
            ]
        });

        if (!orders) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({orders: orders.rows, total: orders.count, page: page, limit: limit});

    }catch(err){
        console.error('Error fetching provider orders:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



const updateOnlineStatus = async (req, res) => {
  try {
    const providerId = req.userId;
    const { isOnline } = req.body;
    const role = req.role;
    
    if (role !== 'provider') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }
    
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    await provider.update({ is_online: isOnline });
    
    res.status(200).json({ 
      message: `Provider is now ${isOnline ? 'online' : 'offline'}`,
      isOnline 
    });
  } catch (e) {
    console.error('Error updating online status:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOnlineStatus = async (req, res) => {
  try {
    const providerId = req.userId;
    const role = req.role;
    
    if (role !== 'provider') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }
    
    const provider = await Provider.findByPk(providerId, {
      attributes: ['is_online']
    });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.status(200).json({ isOnline: provider.is_online || false });
  } catch (e) {
    console.error('Error fetching online status:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const providerId = req.userId;
    const role = req.role;
    if (role !== 'provider') {
        return res.status(403).json({ message: 'Access denied' });
    }
    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }

    // Set up associations for complaints
    CustomerComplaint.belongsTo(CustomerInfo, {
      foreignKey: 'customer_id',
      targetKey: 'id'
    });
    CustomerComplaint.belongsTo(Service, {
      foreignKey: 'service_id', 
      targetKey: 'id'
    });

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalServices, ratingStats, totalOrders, pendingOrders, completedOrders, confirmedOrders, totalEarnings, lastMonthOrders, currentMonthOrders, totalComplaints, openComplaints, resolvedComplaints, latestReview] = await Promise.all([
      services.count({ where: { provider_id: providerId } }),
      ServiceReview.findOne({
        where: { provider_id: providerId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
        ]
      }),
      Order.count({ where: { provider_id: providerId } }),
      Order.count({ where: { provider_id: providerId, status: 'PENDING' } }),
      Order.count({ where: { provider_id: providerId, status: 'COMPLETED' } }),
      Order.count({ where: { provider_id: providerId, status: 'CONFIRMED' } }),
      Order.sum('estimated_charge', {
        where: {
          provider_id: providerId,
          status: 'COMPLETED',
          created: {
            [Op.gte]: currentMonth
          }
        }
      }),
      Order.count({ 
        where: { 
          provider_id: providerId,
          created: {
            [Op.gte]: lastMonth,
            [Op.lt]: currentMonth
          }
        }
      }),
      Order.count({ 
        where: { 
          provider_id: providerId,
          created: {
            [Op.gte]: currentMonth
          }
        }
      }),
      CustomerComplaint.count({ where: { provider_id: providerId } }),
      CustomerComplaint.count({ where: { provider_id: providerId, status: 'OPEN' } }),
      CustomerComplaint.count({ where: { provider_id: providerId, status: 'RESOLVED' } }),
      ServiceReview.findOne({
        where: { provider_id: providerId },
        include: [
            {
                model: CustomerInfo,
                attributes: ['name', 'email'],
            },
            {
                model: Service,
                attributes: ['name'],
            }
        ],
        attributes: ['rating', 'created', 'comment'],
        order: [['created', 'DESC']],
        limit: 1
      })
    ]);

    const averageRating = ratingStats?.getDataValue('averageRating') || 0;
    const totalReviews = ratingStats?.getDataValue('totalReviews') || 0;
    const customer_satisfaction = averageRating > 0 ? averageRating : 0;
    const repeatCustomers = Math.floor(Math.random() * 20) + 5; // Placeholder calculation

    res.status(200).json({
      totalServices,
      totalEarnings: totalEarnings || 0,
      completedOrders,
      pendingOrders,
      confirmedOrders,
      averageRating: parseFloat(averageRating).toFixed(1),
      totalReviews,
      totalOrders,
      lastMonthOrders,
      currentMonthOrders,
      totalComplaints,
      openComplaints,
      resolvedComplaints,
      repeatCustomers,
      repeatCustomersChange: 0,
      satisfactionChange: 0,
      customer_satisfation: parseFloat(customer_satisfaction).toFixed(1),
      latestReview: latestReview ? {
        comment: Array.isArray(latestReview.comment) ? latestReview.comment.join(", ") : latestReview.comment || '',
        rating: latestReview.rating,
        created: new Date(latestReview.created).toLocaleDateString(),
        customerName: latestReview.CustomerInfo?.name || 'Customer',
        serviceName: latestReview.Service?.name || 'Service'
      } : {
        comment: '',
        rating: 0,
        created: '',
        customerName: '',
        serviceName: ''
      }
    });
  } catch (e) {
    console.error('Error fetching dashboard stats:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {getProviderProfile, getProviderWithServices, getProviderStats, getDashboardStats, registerProvider, loginProvider, getProviderOrders, getProviderServices, getProviderBank}