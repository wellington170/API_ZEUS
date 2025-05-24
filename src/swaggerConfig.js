const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerSpec = YAML.load('./src/swagger.yaml');

module.exports = { swaggerUi, swaggerSpec };