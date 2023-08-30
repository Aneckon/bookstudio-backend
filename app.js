require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const router = require('./routers/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
