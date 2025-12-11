const e = require('express');
const todoModel = require('../models/todoModel');

const getAllTodos = async (req,res) => {
    try{
        const todos = await todoModel.getAllTodos();
        res.json(todos);
    } catch (error){
        console.error('Error in get all todos:',error);
        res.status(500).json({error:'Failed to fetch todos'});
    }
};


const getTodoById = async (req,res) => {
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({error: 'Invalid ID format'});
        }

        const todo = await todoModel.getTodoById(id);

        if(!todo){
            return res.status(404).json({error: 'Todo not found'});
        }

        res.json(todo);
    } catch(error){
        console.error('Error in getTodoById:',error);
        res.status(500).json({error: 'Failed to fetch todo'});
    }
};

const createTodo = async (req,res) => {
    try{
        const { task, tags, status } = req.body;


        if(!task || task.trim().length === 0){
            return res.status(400).json({error: 'Task is required'});
        }

        const validStatuses = ['todo', 'doing', 'done'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Status must be one of: todo, doing, done' 
            });
        }

        const newTodo = await todoModel.createTodo({task,tags,status});
        res.status(201).json(newTodo);
    }catch(error){
        console.error('Error in createTodo:',error);
        res.status(500).json({error:'Failed to create todo'});
    }
};


const updateTodo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { task, tags, status } = req.body;
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        const validStatuses = ['todo', 'doing', 'done'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Status must be one of: todo, doing, done' 
            });
        }
        
        const updatedTodo = await todoModel.updateTodo(id, { task, tags, status });
        
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error in updateTodo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        
        const deletedTodo = await todoModel.deleteTodo(id);
        
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json({ 
            message: 'Todo deleted successfully', 
            todo: deletedTodo 
        });
    } catch (error) {
        console.error('Error in deleteTodo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};