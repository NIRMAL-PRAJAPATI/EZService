const RatingModel = require("../models/serviceReview")

const getRatingsFromServiceId = async (req,res)=>{
    try{
        const {id} = req.params;
        const ratings = await RatingModel.findAll({
            where: {service_id: id}
        })

        if(!ratings)
            res.status(404).json({message: "No Reviews Found."})
        res.status(200).json(ratings);
    }catch(err){
        console.log(err)
        res.status(500).json({message:"error in fetching rating"})
    }
}

module.exports = {getRatingsFromServiceId}