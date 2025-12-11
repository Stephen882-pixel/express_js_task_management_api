const express = require('express');
const todoRoutes = require('./routes/todoRoutes');

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
    res.send("TaskApi project!");
});

app.use('/todos', todoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});