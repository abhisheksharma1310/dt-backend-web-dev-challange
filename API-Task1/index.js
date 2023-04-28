/**
 * Important Library
 */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

//import routes
import apiRoutes from './routes/api/index.js';

//configure dotenv
dotenv.config();

//server port
const PORT = process.env.PORT || 5000;

/**
 * Initialize express app
 */
const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

/**
 * Swagger setup
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event API',
      version: '1.0.0',
      description: 'Document for Event API uses'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./routes/*.js', './routes/api/v3/app/events/*.js']
};
const specs = swaggerJsDoc(options);

/**
 * Routes
 */
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api', apiRoutes);

/**
 * Connect to mongoDb database server
 */
const cloudDbUrl = process.env.DB;
const localDbUrl = 'mongodb://localhost:27017/apiTest1Db';

mongoose.connect(cloudDbUrl || localDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`API Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect to database`));

