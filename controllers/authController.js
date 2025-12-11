const userModel = require('../models/userModel');
const authUtils = require('../utils/authUtils');
const emailService = require('../services/emailService');
const { use } = require('react');


// sign up
const signup = async (req,res) => {
    try{
        const { firstName, lastName, email, password } = req.body;

        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({error: 'All fields are required'});
        }

        if(!authUtils.isValidEmail(email)){
            return res.status(400).json({error: 'Invalid email format'});
        }

        if(!authUtils.isStrongPassword(password)){
            return res.status(400).json({ error: 'Invalid email format'});
        }

        if(!authUtils.isStrongPassword(password)){
            return res.status(400).json({
                error:'Password must be at least 8 characters with uppercase, lowercase, and number'
            });
        }

        const existingUser = await userModel.findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({
                error:
                'Email already registered'
            });
        }

        const passwordHash = await authUtils.hashPassword(password);

        const user = await userModel.createUser({
            firstName,
            lastName,
            email,
            passwordHash
        });

        const otpCode = authUtils.generateOTP();
        await userModel.saveOTP(email, otpCode, 'signup', user.id);

        await emailService.sendSignUpOTP(email,firstName,otpCode);

        res.status(201).json({
            message: 'Signup successful! Please check your email for OTP verification.',
            email: email
        });
    } catch (error){
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
};

// Verify OTP (signup)
const verifyOTP = async (req,res) => {
    try{
        const{ email, otpCode } = req.body;

        if(!email || !otpCode){
            return res.status(400).json({
                error:'Email and OTP code are required'
            });
        }

        const otp = await userModel.verifyOTP(email,otpCode,'signup');

        if(!otp){
            return res.status(400).json({error:'Invalid or expired OTP code'});
        }

        await userModel.markOTPAsUsed(otp.id);

        await userModel.verifyUser(email);

        res.json({message:'Email verified successfully! You can now log in.'});
    } catch (error){
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};

const login = async(req,res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ error: 'Email and password are required' });
        }


        const user = await userModel.findUserByEmail(email);

        if(!user){
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ error: 'Please verify your email first' });
        }

        const isPasswordValid = await authUtils.comparePassword(password,user.passwordHash);

        if(!isPasswordValid){
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const accessToken = authUtils.generateAccessToken(user.is,user.email);
        const refreshToken = authUtils.generateRefreshToken(user.is,user.email);
        
        const refreshExpiry = authUtils.getTokenExpiry(process.env.JWT_REFRESH_EXPIRY || '7d');
        await userModel.saveRefreshToken(useReducer.id,refreshToken,refreshExpiry);

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
            refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            }
        });
    } catch (error){
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};


//forgot password
const forgotPassword = async(require,res) => {
    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await userModel.findUserByEmail(email);

        if(!user){
            // Don't reveal if email exists
            return res.json({ message: 'If email exists, OTP has been sent' });
        }

        const otpCode = authUtils.generateOTP();
        await userModel.saveOTP(email,otpCode,'password_reset',user.id);


        await emailService.sendPasswordResetOTP(email,'password_reset',user.id)


        res.json({ message: 'If email exists, OTP has been sent' });
        
    } catch(error){
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

const verifyResetOTP = async (req,res) => {
    try{
        const { email, otpCode } = req.body;


        if(!email || !otpCode){
             return res.status(400).json({ error: 'Email and OTP code are required' });
        }

        const otp =await userModel.verifyOTP(email,otpCode,'password_reset');

        if(!otp){
            return res.status(400).json({ error: 'Invalid or expired OTP code' });
        }

        await userModel.markOTPAsUsed(otp.id);

        res.json({ message: 'OTP verified. You can now reset your password.' });
    }catch(error){
        console.error('Error in verifyResetOTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};


const resetPassword = async (req,res) => {
    try{
        const{ email, newPassword, confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({ error: 'All fields are required' });
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        if(!authUtils.isStrongPassword(newPassword)){
            return res.status(400).json({
                error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
            });
        }
        const newPasswordHash = await authUtils.hashPassword(newPassword);


        const user = await userModel.updatePassword(email,newPasswordHash);

        if(!user){
             return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Password reset successfully' });
    } catch(error){
        console.error('Error in resetPassword:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
