const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Map API routes manually
const taskApi = require('./api/tasks.js');

app.all('/api/tasks', async (req, res) => {
  await taskApi(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ App successfully executing locally!`);
  console.log(`➡️ Open your browser to: http://localhost:${PORT}`);
});
