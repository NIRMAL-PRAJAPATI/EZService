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

const getCategoriesByIds = async (ids)=>{
    try{
        const categories = await ServiceCategory.findAll(
            {
                where: {
                    id: ids
                }
            }
        )
        return categories;
    }catch(err){
        console.log("Error in fetching the categories")
        return [];
    }
}

const getCategories = async (req,res)=>{
    try{
        const categories = await ServiceCategory.findAll();
        if(!categories)
            res.status(404).json([])

        res.status(200).json(categories)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    getServiceCategoryNames,
    getCategoriesByIds,
    getCategories
}
