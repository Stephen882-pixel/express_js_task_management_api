
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authenticate = require('../middleware/authMiddleware');

// All todo routes now require authentication
router.get('/', authenticate, todoController.getAllTodos);
router.get('/:id', authenticate, todoController.getTodoById);
router.post('/', authenticate, todoController.createTodo);
router.put('/:id', authenticate, todoController.updateTodo);
router.delete('/:id', authenticate, todoController.deleteTodo);

// Export the router
module.exports = router;