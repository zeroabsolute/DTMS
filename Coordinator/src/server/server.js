import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import mongoose from 'mongoose';

import serverRoutes from './routes/_index';
import serverConfig from './config';
import loggerService from './logger';

// Init swagger docs
const swaggerDocument = require('../../docs/swagger.json');
const docs = swaggerJsdoc({
  swaggerDefinition: swaggerDocument,
  apis: ['./src/server/**/*.js'],
});

// Initialize the Express App and http server
export const app = express();
const server = require('http').Server(app);

// Initialize logging mechanism
loggerService.initLoggerService();

// Mongoose setup
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// MongoDB Connection
mongoose.connect(serverConfig.mongoUrl, {
  useNewUrlParser: true,
  reconnectTries: 120,
  connectTimeoutMS: 500,
  autoReconnect: true,
  poolSize: 20,
}).then((db) => {
}).catch(function (err) {
  loggerService.getLogger().fatal('Please make sure Mongodb is installed and running!');
  throw err;
});

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cors());
app.use("/api/v1", serverRoutes);
app.use(
  '/api-docs', 
  swaggerUI.serve, 
  swaggerUI.setup(docs, false, { docExpansion: 'none' })
);

// Start app
server.listen(serverConfig.port, (error) => {
  if (error) {
    console.log(`
          \n\n
          --------------------------------
          --------------------------------

          ${serverConfig.appName}:

          Status: Error
          Log: ${error}

          --------------------------------
          --------------------------------
          \n\n`
    );
  } else {
    console.log(`
          \n\n
          --------------------------------
          --------------------------------

          ${serverConfig.appName}:

          Name: API
          Port: ${serverConfig.port}
          Status: OK

          --------------------------------
          --------------------------------
          \n\n`
    );
  }
});


export default server;
