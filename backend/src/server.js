const { PORT } = require('./config/env');

const app = require('./app');
const connectDatabase = require('./config/database');


const startServer = async () => {
  try {

    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Listening on port: ${PORT}`);
    });

    // Graceful Shutdown Handler
    // Listens for termination signals (like SIGTERM or SIGINT) and closes resources cleanly
    const shutdown = (signal) => {
      console.log(`\n⚠️  Received ${signal}. Shutting down server gracefully...`);
      server.close(() => {
        console.log('🛑 HTTP server closed.');
        // Exit process
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error(`💥 Critical Server Startup Error: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();
