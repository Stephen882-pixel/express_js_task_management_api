

const userModel = require('../models/userModel');

const getProfile = async (requestAnimationFrame,res) => {
    try{
        const userId = req.user.userId;

        const user = await userModel.findUserById(userId);

        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                isVerified: user.is_verified,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        });
    } catch(error){
        console.error('Error in getProfile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

