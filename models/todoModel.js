
const pool = require('../config/database');

const getAllTodos = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC',
            [userId]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const getTodoById = async (id, userId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const createTodo = async (todoData, userId) => {
    try {
        const { task, tags, status } = todoData;
        
        const result = await pool.query(
            'INSERT INTO todos (task, tags, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [task, tags || [], status || 'todo', userId]
        );
        
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateTodo = async (id, todoData, userId) => {
    try {
        // First, get the existing todo
        const existingTodo = await getTodoById(id, userId);
        
        if (!existingTodo) {
            return null;
        }
        
        const { task, tags, status } = todoData;
        
        const result = await pool.query(
            `UPDATE todos 
             SET task = $1, 
                 tags = $2, 
                 status = $3, 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [
                task || existingTodo.task,
                tags || existingTodo.tags,
                status || existingTodo.status,
                id,
                userId
            ]
        );
        
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};


const deleteTodo = async (id, userId) => {
    try {
        const result = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        
        return result.rows[0]; 
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};