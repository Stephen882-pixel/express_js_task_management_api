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
        const dbResult = await pool.query('SELECT current_database(), current_user');
        const tableResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        res.json({ 
            status: 'healthy', 
            database: {
                name: dbResult.rows[0].current_database,
                user: dbResult.rows[0].current_user,
                connected: true
            },
            tables: tableResult.rows.map(row => row.table_name)
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message
        });
    }
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/todos', todoRoutes);

app.use('/todos', todoRoutes);


app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});