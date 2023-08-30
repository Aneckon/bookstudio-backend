const express = require('express');
const pool = require('./db');
const cors = require('cors');
const router = require('./routers/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api', async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  router;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
