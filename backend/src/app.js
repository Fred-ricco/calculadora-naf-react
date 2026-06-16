const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const calculoRoutes = require('./routes/calculo.routes');
const emailRoutes = require('./routes/email.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/auth', authRoutes);
app.use('/calculos', calculoRoutes);
app.use('/email', emailRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Backend da Calculadora NAF funcionando!'
  });
});

module.exports = app;
