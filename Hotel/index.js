/**
 * Entry Script
 */

if (process.env.NODE_ENV === 'production') {
  require('./dist/server/server.js');
} else {
  require('babel-register')({});
  require('babel-polyfill');
  require('./src/server/server');
}
