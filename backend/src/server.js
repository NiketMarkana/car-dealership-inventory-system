const { PORT, NODE_ENV } = require('./config/env');
const app = require('./app');
const connectDatabase = require('./config/database');

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode`);
      console.log(`Listening on port: ${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`Received ${signal}. Shutting down server gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(`Critical Server Startup Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
