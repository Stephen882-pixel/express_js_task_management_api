
let todos = [];

const getAllTodos = () => {
    return todos;
};


const getTodoById = (id) => {
    return todos.find(t => t.id === id);
};

// Create new todo
const createTodo = (todoData) => {
    const newTodo = {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        task: todoData.task,
        tags: todoData.tags || [],
        status: todoData.status || 'todo'
    };
    
    todos.push(newTodo);
    return newTodo;
};


const updateTodo = (id, todoData) => {
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return null;
    }
    
    todos[todoIndex] = {
        id: id,
        task: todoData.task || todos[todoIndex].task,
        tags: todoData.tags || todos[todoIndex].tags,
        status: todoData.status || todos[todoIndex].status
    };
    
    return todos[todoIndex];
};

const deleteTodo = (id) => {
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return null;
    }
    
    const deletedTodo = todos.splice(todoIndex, 1);
    return deletedTodo[0];
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};