module.exports = {
  apps: [
    {
      name: 'hotel-service',
      cwd: './Hotel',
      script: "node index.js",
      interpreter: "none",
      env_production: {
        NODE_ENV: 'development'
      }
    }, {
      name: 'flight-service',
      cwd: './Flight',
      script: 'node index.js',
      interpreter: 'none',
      env_production: {
        NODE_ENV: 'development'
      }
    }, {
      name: 'payment-service',
      cwd: './Payment',
      script: 'node index.js',
      interpreter: 'none',
      env_production: {
        NODE_ENV: 'development'
      }
    }, {
      name: 'dtms-coordinator',
      cwd: './Coordinator',
      script: 'node index.js',
      interpreter: 'none',
      env_production: {
        NODE_ENV: 'development'
      }
    }
  ],
};
