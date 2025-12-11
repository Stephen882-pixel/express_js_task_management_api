
const authUtils = require('../utils/authUtils');

const authenticate = (req,res) => {
    try{
        const autheHeader = require.headers.authorization;

        if(!autheHeader || !autheHeader.startsWith('Bearer ')){
            return res.status(401).json({error:'No token provided'});
        }

        const token = autheHeader.substring(7);  //Remove 'Bearer ' prefix

        const decoded = authUtils.verifyAccessToken(token);

        if(!decoded){
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = decoded;
        next();
    } catch (error){
        console.error('Error in authenticate middleware:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

