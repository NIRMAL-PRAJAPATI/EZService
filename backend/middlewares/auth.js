const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' })
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' })
            }
            req.userId = decoded.id;
            req.role = decoded.role;
            console.log("from verification : " + req.userId + " " + req.role)
            
            next()
        })
    }
    catch (error) {
        console.error('Error verifying token:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = verifyToken;

