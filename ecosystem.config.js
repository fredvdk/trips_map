module.exports = {

apps: [
    {
      name: 'usa_trips',
      script: 'npm',
      args: 'run start',
      cwd: '/data/Srv/www/trips_map/',
      instances: 1, 
      exec_mode: 'cluster', // Enable load balancing
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]

};
