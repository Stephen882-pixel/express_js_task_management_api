CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);

SELECT * FROM todos;