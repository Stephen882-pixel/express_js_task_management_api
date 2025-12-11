const todoModel = require('../models/todoModel');

const getAllTodos = (req, res) => {
    const todos = todoModel.getAllTodos();
    res.json(todos);
};

const getTodoById = (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todoModel.getTodoById(id);
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
};


const createTodo = (req, res) => {
    const { task, tags, status } = req.body;

    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    
    const newTodo = todoModel.createTodo({ task, tags, status });
    res.status(201).json(newTodo);
};

const updateTodo = (req, res) => {
    const id = parseInt(req.params.id);
    const { task, tags, status } = req.body;
    
    const updatedTodo = todoModel.updateTodo(id, { task, tags, status });
    
    if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo);
};


const deleteTodo = (req, res) => {
    const id = parseInt(req.params.id);
    const deletedTodo = todoModel.deleteTodo(id);
    
    if (!deletedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ 
        message: 'Todo deleted successfully', 
        todo: deletedTodo 
    });
};


module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};