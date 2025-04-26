const CategoryTemplate = require("../models/categoryTemplate")

const getAllTemplates = async (req,res)=>{
    try{
        const templates = await CategoryTemplate.findAll();
        if(!templates)
            res.status(404).json({message:"Templates not found"})

        res.status(200).json(templates)
    }catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {
    getAllTemplates
}