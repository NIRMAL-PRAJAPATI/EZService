module.exports = (req, res, next)=>{
    try{
        let {limit, page} = req.query;
        limit = parseInt(limit) || 5;
        page = parseInt(page) || 1;

        if(limit > 100) limit = 100;

        const offset = limit*(page-1);
        req.pagination = {limit, page, offset}
        next()
    }catch(err){
        res.status(500).json({message:"Invalid Page Limit"})
    }
}