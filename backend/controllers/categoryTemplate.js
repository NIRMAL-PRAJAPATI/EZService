const CategoryTemplate = require("../models/categoryTemplate")
const {getCategoriesByIds} = require("../controllers/serviceCategory");

const getAllTemplates = async (req,res)=>{
    try{
        const {limit, page, offset} = req.pagination;
        const templates = await CategoryTemplate.findAll({
            limit:limit
        });
        if(!templates)
            res.status(404).json({message:"Templates not found"})
        
        const improvedtemplates = await Promise.all(templates.map(async (template)=>{
            let categories = []
            
            if(template.categories && template.categories.length > 0)
                categories = await getCategoriesByIds(template.categories);
            
            return {
                ...template.toJSON(), categories:categories
            }
        })
    );

        res.status(200).json(improvedtemplates)
    }catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getMinimalTemplate = async (req,res)=>{
    try{
        const templates = await CategoryTemplate.findAll({
            attributes: ["id","name"]
        })

        if(!templates)
            res.status(404).json({message: "Templates not found"})

        res.status(200).json(templates)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {
    getAllTemplates,
    getMinimalTemplate
}