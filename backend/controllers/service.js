const service = require('../models/service');
const ServiceCategory = require('../models/serviceCategory');
const providerInfo = require("../models/providerInfo")
const {getRatingsFromServiceId} = require("./serviceReview")
const Sequelize = require("../db")

const getServices = async (req, res) => {
    try {
        const {page, limit} = req.pagination;
        const services = await service.findAll({
            attributes: ['id','name', 'cover_image', 'visiting_charge', 'instant_visiting_charge', 'description', 'city', 'state', 'country', 'category_id','badge_status','created','experience','working_images',
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
  
const updateService = async (req, res)=>{
    try{
        const {userId, role} = req;
        const {id} = req.params;
        console.log("UserId: ", userId, "Role: ", role, "Service Id: ", id)

        if(role !== "provider")
            return res.status(403).json({message: "Unauthorized Action"})
        const provider = await providerInfo.findByPk(userId)

        if(!provider)
            return res.status(404).json({message: "Provider Doesn't Exists"})

        const service_ = await service.findOne({ where: {id, provider_id: userId}})
        
        if (!service_) {
            return res.status(404).json({message: "Service not found"})
        }
        
        const data = req.body;
        
        // Handle file uploads
        let payload = {
            name: data.name,
            visiting_charge: data.visiting_charge,
            instant_visiting_charge: data.instant_visiting_charge,
            description: data.description,
            locations: data.locations,
            experience: data.experience,
            specifications: data.specifications,
            badge_status: data.badge_status,
            city: data.city || service_.city,
            state: data.state || service_.state,
            country: data.country || service_.country,
            category_id: data.category_id,
            service_type: data.service_type
        };
        
        // Only update images if new files are provided
        if (req.files) {
            
            // Process cover image
            if (req.files['cover_image'] && req.files['cover_image'][0]) {
                const file = req.files['cover_image'][0];
                // Extract the path relative to uploads/services
                const relativePath = file.path.split('uploads/services/')[1] || file.path.split('uploads\\services\\')[1];
                payload.cover_image = `/uploads/services/${relativePath || file.filename}`;
            }
            
            // Process working images
            if (req.files['working_images'] && req.files['working_images'].length > 0) {
                
                // Replace existing images with new ones
                payload.working_images = req.files['working_images'].map(file => {
                    // Extract the path relative to uploads/services
                    const relativePath = file.path.split('uploads/services/')[1] || file.path.split('uploads\\services\\')[1];
                    return `/uploads/services/${relativePath || file.filename}`;
                });
                
            }
        }
        
        await service_.update(payload)

        res.status(200).json({
            message: "Service Updated Successfully",
            service: await service.findByPk(id)
        })

    }catch(err){
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const createService = async (req, res) => {
  try {
    const { userId, role } = req;
    
    if (role !== "provider")
      return res.status(403).json({ message: "Unauthorized Action" });
    
    const provider = await providerInfo.findByPk(userId);
    
    if (!provider)
      return res.status(404).json({ message: "Provider Doesn't Exist" });
    
    const data = req.body;
    
    // Handle file uploads
    let coverImagePath = null;
    let workingImagePaths = [];
    
    if (req.files) {
      console.log("Files received in create:", req.files);
      
      // Process cover image
      if (req.files['cover_image'] && req.files['cover_image'][0]) {
        const file = req.files['cover_image'][0];
        // Use just the filename for consistent paths
        coverImagePath = `/uploads/services/${file.filename}`;
      }
      
      // Process working images
      if (req.files['working_images'] && req.files['working_images'].length > 0) {
        console.log("Working images received:", req.files['working_images']);
        
        workingImagePaths = req.files['working_images'].map(file => {
          // Just use the filename directly for consistent paths
          return `/uploads/services/${file.filename}`;
        });
        
        console.log("Working image paths:", workingImagePaths);
      }
    }
    
    const payload = {
      name: data.name,
      cover_image: coverImagePath,
      visiting_charge: data.visiting_charge,
      instant_visiting_charge: data.instant_visiting_charge,
      description: data.description,
      locations: data.locations,
      experience: data.experience,
      specifications: data.specifications,
      working_images: workingImagePaths,
      badge_status: false, // Default to false for new services
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
      category_id: data.category_id,
      service_type: data.service_type,
      provider_id: userId,
      created: new Date()
    };
    
    const newService = await service.create(payload);
    
    res.status(201).json({
      message: "Service Created Successfully",
      service: newService
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Order = require('../models/order');

const deleteService = async (req, res)=>{
    try{
        const {userId, role} = req;
        const {id} = req.params;

        if(role !== "provider")
            return res.status(403).json({message: "Unauthorized Action"})

        const provider = await providerInfo.findByPk(userId)

        if(!provider)
            return res.status(404).json({message: "Provider Doesn't Exists"})

        const service_ = await service.findOne({ where: {id, provider_id: userId}})

        if (!service_) {
            return res.status(404).json({message: "Service not found"})
        }
        
        // Check if there are any orders referencing this service
        const relatedOrders = await Order.count({ where: { service_id: id } });
        
        if (relatedOrders > 0) {
            return res.status(409).json({
                message: "Cannot delete this service because it has associated orders",
                ordersCount: relatedOrders
            });
        }

        await service_.destroy()

        res.status(200).json({message: "Service Deleted Successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {getServices, getVerifiedServices, getServicesByCategoryId, getServiceById, updateService, createService, deleteService};