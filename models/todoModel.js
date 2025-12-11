const pool = require('../config/database');

const getAllTodos = async () => {
    try{
        const result = await pool.query(
            'SELECT * FROM todos ORDER BY id ASC'
        );
        return result.rows;
    } catch (error){
        throw error;
    }
};

