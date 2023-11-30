// Import necessary modules
const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const db = new Sequelize({
  // Your database configuration
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'ferpanda16',
  database: 'directorio_medico',
});

// Export the Sequelize instance
module.exports = db;
