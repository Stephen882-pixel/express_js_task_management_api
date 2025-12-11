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

