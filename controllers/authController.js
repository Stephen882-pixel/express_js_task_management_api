const userModel = require('../models/userModel');
const authUtils = require('../utils/authUtils');
const emailServie = require('../services/emailService');
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

        await emailServie.sendSignUpOTP(email,firstName,otpCode);

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



