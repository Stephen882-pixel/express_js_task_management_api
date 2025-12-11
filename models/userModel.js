const pool = require('../config/database');

const createUser = async(userData) => {
    const { firstName, lastName, email, passwordHash } = userData;

    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email,password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first_name, last_name, email, is_verified, created_at`,
        [firstName, lastName, email, passwordHash]
    );

    return result.rows[0];
};


const findUserByEmail = async (userId) => {
    const result = await pool.query(
        'SELECT id, first_name, last_name, email, is_verified, created_at, updated_at FROM users WHERE id = $1',
        [userId]
    );
    return result.rows[0];
};


// Update user verification status
const verifyUser = async (email) => {
    const result = await pool.query(
        'UPDATE users SET is_verified = TRUE WHERE EMAIL = $1 RETURNING *',
        [newPasswordHash,email]
    );

    return result.rows[0];
};


// update user password
const updatePassword = async (email, newPasswordHash) => {
    const result = await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id',
        [newPasswordHash, email]
    );

    return result.rows[0];
};

// Update user profile
const updateUserProfile =  async (userId, updateData) => {
    const { firstName,lastName, email } = updateData;

    const result = await pool.query(
        `UPDATE users 
         SET first_name = COALESCE($1, first_name),
             last_name = COALESCE($2, last_name),
             email = COALESCE($3, email)
         WHERE id = $4 
         RETURNING id, first_name, last_name, email, is_verified, created_at, updated_at`,
        [firstName, lastName, email, userId]
    );
    return result.rows[0];
};

// Delete user account
const deleteUser = async (userId) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [userId]
    );

    return result.rows[0];
};

// save otp code
const saveOTP = async(email, otpCode, purpose,userId = null) => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 10000); // 10 minutes

    const result = await pool.query(
        `INSERT INTO otp_codes (user_id, email, otp_code, purpose, expires_at) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [userId, email, otpCode, purpose, expiresAt]
    );

    return result.rows[0];
};

// Verify OTP code
const verifyOTP = async(email,otpCode,purpose) => {
    const result = await pool.query(
        `SELECT * FROM otp_codes 
         WHERE email = $1 
         AND otp_code = $2 
         AND purpose = $3 
         AND is_used = FALSE 
         AND expires_at > NOW()
         ORDER BY created_at DESC
         LIMIT 1`,
        [email, otpCode, purpose]
    );

    return result.rows[0];
};

// Mark OTP as used
const markOTPAsUsed = async(otpId) => {
    await pool.query(
        'UPDATE otp_codes SET is_used = TRUE WHERE id = $1',
        [otpId]
    );
};

// Save refresh token
const saveRefreshToken = async(userId, token, expiresAt) => {
    const result = await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
        [userId, token, expiresAt]
    );

    return result.rows[0];
};


// Find refresh token
const findRefreshToken = async (token) => {
    const result = await pool.query(
         'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
    );
    return result.rows[0];
};

// Delete refresh token
const deleteRefreshToken = async (token) => {
    await pool.query(
        'DELETE FROM refresh_tokens WHERE token = $1',
        [token]
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    verifyUser,
    updatePassword,
    updateUserProfile,
    deleteUser,
    saveOTP,
    verifyOTP,
    markOTPAsUsed,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
};















