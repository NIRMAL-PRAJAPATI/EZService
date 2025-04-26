const service = require('../models/service');
const service_category = require('../models/serviceCategory');

const getServices = async (req, res) => {
    try {
        const services = await service.findAll({
            attributes: ['name', 'cover_image', 'visiting_charge', 'description', 'city', 'state', 'country', 'category_id'],
            include: [{
                model: service_category,
                attributes: ['name'],
            }]
        })

        if(!services) {
            res.status(404).json({code: 404, message: 'services not found'});
        }

        res.status(200).json(services);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = {getServices};