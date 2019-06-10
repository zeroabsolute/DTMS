const env = require('dotenv').config();
const envConfig = env.parsed;

let config = null;
const currentEnv = process.env.NODE_ENV;

if (
  envConfig &&
  envConfig.APP_NAME &&
  envConfig.SERVER_URL &&
  envConfig.PORT &&
  envConfig.MYSQL_URL
) {
  config = {
    appName: envConfig.APP_NAME,
    serverUrl: envConfig.SERVER_URL,
    port: envConfig.PORT,
    mysqlUrl: envConfig.MYSQL_URL,
  };
}

export default config;
