const Provider = require('../models/providerInfo')
const services = require('../models/service')
const provider_bank = require("../models/providerBank");
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const ServiceReview = require('../models/serviceReview');
const { Op, literal } = require('sequelize');
const sequelize = require('../db');
const CustomerInfo = require('../models/customerInfo');
const Service = require('../models/service');

const getProviderProfile = async (req, res) => {
    try{
        const providerId = req.params.id;
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const provider = await Provider.findByPk(providerId, {
            include: [
        {
                model: provider_bank,
                as: 'providerBank'
        }]
        });
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
        const providerId = req.params.id;
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

const getProviderStats = async (req, res) => {
  try {
    const providerId = req.params.id;
    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }

    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const [totalServices, ratingStats, totalOrders, pendingOrders, completedOrders, lastMonthOrders, currentMonthOrders, totalEarnings, latestReview] = await Promise.all([
      services.count({ where: { provider_id: providerId } }),
      ServiceReview.findOne({
        where: { provider_id: providerId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
        ]
      }),
      Order.count({ where: { provider_id: providerId } }),
      Order.count({ where: { provider_id: providerId, status: 'pending' } }),
      Order.count({ where: { provider_id: providerId, status: 'fulfilled' } }),
      Order.count({ where: { provider_id: providerId,
            created: {
                [Op.gte]: literal(`DATE_TRUNC('month', NOW() - INTERVAL '1 MONTH')`),
                [Op.lt] : literal(`DATE_TRUNC('month', NOW())`)
            }
        }, 
        group: ['status']
    }
    ),
      Order.count({ where: { provider_id: providerId,
            created: {
                [Op.gte]: literal(`DATE_TRUNC('month', NOW())`),
            },
            },
            group: ['status']
        }),
      Order.sum('estimated_charge', {
        where: {
          provider_id: providerId,
          status: 'fulfilled',
          created: {
            [Op.gte]: literal(`NOW() - INTERVAL '1 MONTH'`)
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
        attributes: [ 'rating', 'created', 'comment'],
        order: [['created', 'DESC']],
        limit: 1
      })
    ]);

    const averageRating = ratingStats?.getDataValue('averageRating') || 0;
    const totalReviews = ratingStats?.getDataValue('totalReviews') || 0;

    res.status(200).json({
      totalServices,
      totalEarnings: totalEarnings || 0,
      completedOrders,
      pendingOrders,
      averageRating,
      totalReviews,
      totalOrders,
      latestReview: latestReview ? {
        comment: latestReview.comment.join(", "),
        rating: latestReview.rating,
        created: latestReview.created,
        customerName: latestReview.CustomerInfo.name,
        serviceName: latestReview.Service.name
      } : null,
    lastMonthOrders,
    currentMonthOrders
    });
  } catch (e) {
    console.error('Error fetching provider stats:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const registerProvider = async (req, res)=>{
    try{
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password ) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingProvider = await Provider.findOne({ where: {
            [Op.or]: [
                { email: email },
                { phone: phone }
            ]
        } });
        if (existingProvider) {
            return res.status(409).json({ message: 'Provider already exists' });
        }

        const newProvider = await Provider.create({ name, email, phone, passowrd });
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

        const token = jwt.sign({ id: provider.id, role: 'provider'}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({provider, token});
    }catch(e){
        console.error('Error logging in provider:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {getProviderProfile, getProviderWithServices, getProviderStats, registerProvider, loginProvider}