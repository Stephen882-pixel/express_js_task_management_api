const pool = require('../config/database');

// ---------------- CREATE USER ----------------
const createUser = async (userData) => {
    const { firstName, lastName, email, passwordHash } = userData;

    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, first_name, last_name, email, is_verified, created_at`,
        [firstName, lastName, email, passwordHash]
    );

    return result.rows[0];
};

// ---------------- FIND USER BY EMAIL ----------------
const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, first_name, last_name, email, password_hash, is_verified, created_at, updated_at
         FROM users
         WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};


// ---------------- VERIFY USER ----------------
const verifyUser = async (email) => {
    const result = await pool.query(
        `UPDATE users 
         SET is_verified = TRUE 
         WHERE email = $1 
         RETURNING id, email, is_verified`,
        [email]
    );

    return result.rows[0];
};

// ---------------- UPDATE PASSWORD ----------------
const updatePassword = async (email, newPasswordHash) => {
    const result = await pool.query(
        `UPDATE users 
         SET password_hash = $1 
         WHERE email = $2 
         RETURNING id`,
        [newPasswordHash, email]
    );

    return result.rows[0];
};

// ---------------- UPDATE USER PROFILE ----------------
const updateUserProfile = async (userId, updateData) => {
    const { firstName, lastName, email } = updateData;

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

// ---------------- DELETE USER ----------------
const deleteUser = async (userId) => {
    const result = await pool.query(
        `DELETE FROM users 
         WHERE id = $1 
         RETURNING id`,
        [userId]
    );

    return result.rows[0];
};

// ---------------- SAVE OTP ----------------
const saveOTP = async (email, otpCode, purpose, userId = null) => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const result = await pool.query(
        `INSERT INTO otp_codes (user_id, email, otp_code, purpose, expires_at) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, email, otpCode, purpose, expiresAt]
    );

    return result.rows[0];
};

// ---------------- VERIFY OTP ----------------
const verifyOTP = async (email, otpCode, purpose) => {
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

// ---------------- MARK OTP AS USED ----------------
const markOTPAsUsed = async (otpId) => {
    await pool.query(
        `UPDATE otp_codes 
         SET is_used = TRUE 
         WHERE id = $1`,
        [otpId]
    );
};

// ---------------- SAVE REFRESH TOKEN ----------------
const saveRefreshToken = async (userId, token, expiresAt) => {
    const result = await pool.query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, token, expiresAt]
    );

    return result.rows[0];
};

// ---------------- FIND REFRESH TOKEN ----------------
const findRefreshToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM refresh_tokens 
         WHERE token = $1 
         AND expires_at > NOW()`,
        [token]
    );

    return result.rows[0];
};

// ---------------- DELETE REFRESH TOKEN ----------------
const deleteRefreshToken = async (token) => {
    await pool.query(
        `DELETE FROM refresh_tokens 
         WHERE token = $1`,
        [token]
    );
};

module.exports = {
    createUser,
    findUserByEmail,
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
