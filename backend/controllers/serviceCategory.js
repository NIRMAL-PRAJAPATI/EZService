const ServiceCategory = require("../models/serviceCategory")

const getServiceCategoryNames = async (req,res)=>{
    try{
        const categories = await ServiceCategory.findAll({
            attributes: ['id','name']
        })

        if(!categories)
            res.status(404).json({
                code: 404,
                message: 'No categories found'
            })

        res.status(200).json(categories)
    }catch(err){
        console.log("serviceCategory : ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    getServiceCategoryNames
}
