const RatingModel = require("../models/serviceReview")
const CustomerInfo = require("../models/customerInfo")

const getRatingsFromServiceId = async (req,res)=>{
    try{
        const {id} = req.params;
        const ratings = await RatingModel.findAll({
            where: {service_id: id},
            order: [['created', 'DESC']],
            include: [{ model: CustomerInfo, attributes: ['name'] }]
        })

        if(!ratings)
            res.status(404).json({message: "No Reviews Found."})
        res.status(200).json(ratings);
    }catch(err){
        console.log(err)
        res.status(500).json({message:"error in fetching rating"})
    }
}

const Order = require("../models/order")

// Customer reviews a service they had completed. One review per customer per service.
const createReview = async (req, res) => {
    try {
        const { userId, role } = req;
        if (role !== 'customer') {
            return res.status(403).json({ message: "Only customers can leave reviews" });
        }

        const { order_id, rating, comment } = req.body;
        const stars = parseInt(rating, 10);
        if (!order_id || !(stars >= 1 && stars <= 5)) {
            return res.status(400).json({ message: "Please choose a rating from 1 to 5" });
        }

        const order = await Order.findOne({ where: { order_id, customer_id: userId } });
        if (!order) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (order.status !== 'COMPLETED') {
            return res.status(400).json({ message: "You can review a service after it is completed" });
        }

        const existing = await RatingModel.findOne({ where: { service_id: order.service_id, customer_id: userId } });
        if (existing) {
            return res.status(409).json({ message: "You have already reviewed this service" });
        }

        const review = await RatingModel.create({
            service_id: order.service_id,
            provider_id: order.provider_id,
            customer_id: userId,
            rating: stars,
            comment: comment && comment.trim() ? [comment.trim()] : [],
            created: new Date()
        });

        res.status(201).json(review);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "error in saving review" })
    }
}

module.exports = {getRatingsFromServiceId, createReview}