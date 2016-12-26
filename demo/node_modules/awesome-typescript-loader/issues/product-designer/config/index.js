const path = require('path');

const config = new Map();

config.set('NODE_ENV', process.env.NODE_ENV);

config.set('project-path', path.resolve(__dirname, '../'));
config.set('src-path', path.resolve(__dirname, '../src'));
config.set('build-path', path.resolve(__dirname, '../build'));

config.set('webpack-host', 'localhost');
config.set('webpack-port', 8800);
config.set('webpack-url', `http://${config.get('webpack-host')}:${config.get('webpack-port')}`);

config.set('proxy', 'http://localhost:5050');

module.exports = config;
