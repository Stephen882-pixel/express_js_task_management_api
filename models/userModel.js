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








