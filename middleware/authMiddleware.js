
const authUtils = require('../utils/authUtils');

const authenticate = (req, res, next) => {
    try {
        // Safely get authorization header
        const authHeader = req.headers?.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization token missing or invalid" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = authUtils.verifyAccessToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // attach user to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error("Error in authenticate middleware:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
};

module.exports = authenticate;