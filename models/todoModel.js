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


const getTodoById = async (id) => {
    try{
        const result = await pool.query(
            'SELECT * FROM todos WHERE id = $1',
            [id]
        );
        return result.rows[0];
    } catch (error){
        throw error;
    }
};


const createTodo = async (todoData) => {
    try{
        const { task, tags, status } = todoData;

        const result = await pool.query(
            'INSERT INTO todos (task, tags, status) VALUES ($1, $2, $3) RETURNING *',
            [task, tags || [], status || 'todo']
        );
        return result.rows[0];
    } catch (error){
        throw error;
    }
}; 

