
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

const getTodoById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT * FROM todos WHERE id = $1',
            [id]
        );
        return result.rows[0]; // Returns undefined if not found
    } catch (error) {
        throw error;
    }
};

const createTodo = async (todoData) => {
    try {
        const { task, tags, status } = todoData;
        
        const result = await pool.query(
            'INSERT INTO todos (task, tags, status) VALUES ($1, $2, $3) RETURNING *',
            [task, tags || [], status || 'todo']
        );
        
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateTodo = async (id, todoData) => {
    try {
        // First, get the existing todo
        const existingTodo = await getTodoById(id);
        
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
             WHERE id = $4 
             RETURNING *`,
            [
                task || existingTodo.task,
                tags || existingTodo.tags,
                status || existingTodo.status,
                id
            ]
        );
        
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};


const deleteTodo = async (id) => {
    try {
        const result = await pool.query(
            'DELETE FROM todos WHERE id = $1 RETURNING *',
            [id]
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