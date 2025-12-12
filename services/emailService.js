
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,  // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

// send otp for signup verification
const sendSignUpOTP = async (email,firstName, otpCode) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Email - Task API',
        html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Task API, ${firstName}!</h2>
                <p>Thank you for signing up. Please verify your email address using the OTP code below:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otpCode}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't sign up for Task API, please ignore this email.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">Task API - Task Management System</p>
            </div>
        `,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`SignUp OTP sent to ${email}`);
        return true;
    } catch (error){
        console.error('Error sending signup OTP:', error);
        throw new Error('Failed to send verification email');
    }
};

// send otp for password reset

const sendPasswordResetOTP = async (email, firstName, otpCode) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to:email,
        subject:'Password Reset Request - Task API',
        html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hi ${firstName},</p>
                <p>We received a request to reset your password. Use the OTP code below to proceed:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otpCode}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">Task API - Task Management System</p>
            </div>
        `,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Password reset OTP sent to ${email}`);
        return true;
    } catch(error){
        console.log('Error sending password reset OTP:', error);
        throw new Error('Failed to send password reset email');
    }
};


module.exports = {
    sendSignUpOTP,
    sendPasswordResetOTP
};




