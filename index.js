const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const pool = require('./config/database');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/',(req,res) => {
    res.json({
        message: "TaskApi Project",
        status:"running",
        endpoints:{
            todos: "/todos",
            health: "/health"
        }
    });
});

app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message
        });
    }
});

app.use('/todos', todoRoutes);


app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});