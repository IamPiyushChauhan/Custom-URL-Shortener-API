require('dotenv').config();

const express = require('express'); 
const app = express(); 
const session = require('express-session');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const mainRoutes = require('./routes/mainRoute');
const apiRoutes = require('./routes/apiRoute');
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.js');

const MONGO_DB_URL = process.env.MONGO_DB_URL;

mongoose.connect(MONGO_DB_URL)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET 
}));

app.set('view engine', 'ejs');

app.use('/',mainRoutes);
app.use('/auth',userRoutes);
app.use('/api', apiRoutes);   

const swaggerMiddleware = (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  console.log('Base URL:', baseUrl);
  swaggerSpecs.host = baseUrl.slice(7, baseUrl.length)
  app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  next();
};

app.use('/api-docs',swaggerMiddleware);



app.listen(3000 , () => { 
	console.log("Server Running on port 3000"); 
});