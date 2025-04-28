const getCity = async  (req,res)=>{
    try{
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        const url = (ip === '::1' || ip === '127.0.0.1')? `https://ipinfo.io/city?token=798c2d8830d144` : `https://ipinfo.io/${ip}/city?token=798c2d8830d144`
        const response = await fetch(url);
        const data = (await response.text()).trimEnd("\n").toLowerCase();

        return data ? res.send(data) : res.send(res.send(data));
    }catch(err){
        console.log(err)
        res.send('ahmedabad');
    }
}

module.exports = getCity;