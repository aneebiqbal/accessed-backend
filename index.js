const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');


const app = express();
app.use(express.json({ limit: "80mb" })); 

app.use(bodyParser.json());
app.use(cors());
// app.set('trust proxy', 1); 

app.use('/auth', authRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app
