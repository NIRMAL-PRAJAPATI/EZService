const service = require('../models/service');
const ServiceCategory = require('../models/serviceCategory');
const providerInfo = require("../models/providerInfo")
const {getRatingsFromServiceId} = require("./serviceReview")
const Sequelize = require("../db")

const getServices = async (req, res) => {
    try {
        const {page, limit} = req.pagination;
        const services = await service.findAll({
            attributes: ['name', 'cover_image', 'visiting_charge', 'description', 'city', 'state', 'country', 'category_id','id',
                    
                      [
                        Sequelize.literal(`(SELECT AVG("rating") FROM "service_review" WHERE "service_review"."service_id" = "Service"."id")`),
                        'average_rating'
                      ]
            ],
            include: [{
                model: ServiceCategory,
                as: 'category',
                attributes: ['name'],
            },
            {
                model: providerInfo,
                attributes: ['name','id']
            }],
            limit:limit
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

const getVerifiedServices = async (req, res)=>{
    try{
        const {limit, page} = req.pagination;
        const services = await service.findAll({
            attributes: ['id','name', 'cover_image', 'visiting_charge', 'description', 'city', 'state', 'country', 'category_id','badge_status','created','experience','working_images'],
            include: [{
                model: ServiceCategory,
                as: 'category',
                attributes: ['name'],
            },
            {
                model: providerInfo,
                attributes: ['name','id']
            }
          ],
            limit:limit,
            where: {'badge_status':true}
        })

        if(!services){
            res.status(404).json({code: 404, message: 'services not found'});
        }
        res.status(200).json(services)
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getServicesByCategoryId = async (req,res)=>{
    try{
        const {id} = req.params;
        const services = await service.findAll({
            where: {category_id:id},
            attributes: ['id','name', 'cover_image', 'visiting_charge', 'description', 'city', 'state', 'country', 'category_id','badge_status','created','experience','working_images',[
                Sequelize.literal(`(SELECT AVG("rating") FROM "service_review" WHERE "service_review"."service_id" = "Service"."id")`),
                'average_rating'
              ]]
        })

        if(!services)
            res.status(404).json({message: "No Services Found"})

        res.status(200).json(services)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getServiceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const item = await service.findByPk(id, {
        include: [
          {
            model: providerInfo,
          },
          {
            model: ServiceCategory,
            as: 'category',
            attributes: ["name", "id"],
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                SELECT AVG("rating")
                FROM "service_review"
                WHERE "service_review"."service_id" = "Service"."id"
              )`),
              "average_rating",
            ],
          ],
        },
      });
  
      if (!item) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.status(200).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

module.exports = {getServices, getVerifiedServices, getServicesByCategoryId, getServiceById};