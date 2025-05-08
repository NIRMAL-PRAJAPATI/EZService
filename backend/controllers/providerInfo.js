const Provider = require('../models/providerInfo')
const services = require('../models/service')
const provider_bank = require("../models/providerBank");
const { Sequelize } = require('sequelize');
const Order = require('../models/order');
const ProviderBank = require('../models/providerBank');

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

const getProviderStats = async (req,res)=>{
    try{
        const providerId = req.params.id;
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const provider = await Provider.findByPk(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        const totalServices = await services.count({ where: { provider_id: providerId } });
        if (totalServices === 0) {
            return res.status(200).json({ message: 'No services found for this provider' });
        }
        const totalEarnings = await Order.sum('estimated_charge', {
            where: {
                provider_id: providerId,
                status: 'fulfilled'
            }
        });

        const totalOrders = await Order.count({
            where: {
                provider_id: providerId,
            }
        });

        const pendingOrders = await Order.count({
            where: {
                provider_id: providerId,
                status: 'pending'
            }
        });

        if (totalEarnings === 0) {
            return res.status(200).json({ message: 'No earnings found for this provider' });
        }
        res.status(200).json({ totalServices, totalEarnings, totalOrders, pendingOrders });
    }catch(e){
        console.error('Error fetching provider stats:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const registerProvider = async (req, res)=>{
    try{
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password ) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingProvider = await Provider.findOne({ where: { email } });
        if (existingProvider) {
            return res.status(409).json({ message: 'Provider already exists' });
        }
        const encPassword = await bcrypt.hash(password, 10);
        if (!encPassword) {
            return res.status(500).json({ message: 'Error encrypting password' });
        }
        const newProvider = await Provider.create({ name, email, phone, encPassword });
        res.status(201).json(newProvider);

    }catch(e){
        console.error('Error registering provider:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {getProviderProfile, getProviderWithServices, getProviderStats, registerProvider}