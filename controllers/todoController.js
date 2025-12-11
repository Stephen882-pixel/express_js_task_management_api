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

