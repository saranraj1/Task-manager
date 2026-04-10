const { Pool } = require('pg');

let isDev = !(process.env.POSTGRES_URL || process.env.DATABASE_URL);

let pool = null;
if (!isDev) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

// In-memory fallback
let mockTasks = [
  { id: 't1', title: 'Local Mock Environment Active', completed: false, createdat: new Date().toISOString() },
  { id: 't2', title: 'Connect to Postgres (Add DATABASE_URL)', completed: false, createdat: new Date().toISOString() }
];

const initDB = async () => {
  if (isDev) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error('Table init error:', err);
    isDev = true; // Fallback if query fails completely
  } finally {
    client.release();
  }
};

if (!isDev) {
  initDB().catch((e) => {
    console.error("DB Initialization failed. Falling back to local mock data.", e);
    isDev = true;
  });
}

module.exports = async function (req, res) {
  try {
    if (req.method === 'GET') {
      if (isDev) return res.status(200).json(mockTasks.sort((a,b) => new Date(b.createdat) - new Date(a.createdat)));
      
      const result = await pool.query('SELECT * FROM tasks ORDER BY createdat DESC');
      return res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      const { id, title, completed, createdAt } = req.body;
      if (!title || title.length < 3) return res.status(400).json({ error: 'Title must be at least 3 characters.' });
      
      const taskId = id || `t${Date.now()}`;
      const taskCompleted = completed || false;
      const taskCreated = createdAt || new Date().toISOString();

      if (isDev) {
        const newTask = { id: taskId, title, completed: taskCompleted, createdat: taskCreated };
        mockTasks.push(newTask);
        return res.status(201).json(newTask);
      }

      const result = await pool.query(
        'INSERT INTO tasks (id, title, completed, createdat) VALUES ($1, $2, $3, $4) RETURNING *',
        [taskId, title, taskCompleted, taskCreated]
      );
      return res.status(201).json(result.rows[0]);
    } else if (req.method === 'PATCH') {
      const { id } = req.query;
      const { title, completed } = req.body;
      
      if (isDev) {
        let task = mockTasks.find(t => t.id === id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        if (title !== undefined) task.title = title;
        if (completed !== undefined) task.completed = completed;
        return res.status(200).json(task);
      }

      let query;
      let values;
      if (title !== undefined && completed !== undefined) {
         query = 'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *';
         values = [title, completed, id];
      } else if (title !== undefined) {
         query = 'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *';
         values = [title, id];
      } else if (completed !== undefined) {
         query = 'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *';
         values = [completed, id];
      } else {
         return res.status(400).json({ error: 'No valid fields provided.' });
      }

      const result = await pool.query(query, values);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (isDev) {
        mockTasks = mockTasks.filter(t => t.id !== id);
        return res.status(200).json({ message: 'Deleted' });
      }
      await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
