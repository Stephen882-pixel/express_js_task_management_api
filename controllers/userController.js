

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

const updateProfile = async (req,res) => {
    try{
        const userId = req.user.userId;
        const { firstName, lastName, email } = req.body;

        if(email){
            const existingUser = await userModel.findUserByEmail(email);
            if(existingUser &&existingUser.id !== userId){
                return res.status(409).json({ error: 'Email already in use' });
            }
        }
        const updateUser = await userModel.updateUserProfile(userId,{
            firstName,
            lastName,
            email
        });

        if(!updateUser){
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                email: updatedUser.email,
                isVerified: updatedUser.is_verified,
                updatedAt: updatedUser.updated_at
            }
        });
    } catch(error){
        console.error('Error in updateProfile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

