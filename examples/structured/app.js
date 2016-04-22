
// Import libs
	var fs = require('fs');
	var path = require('path');
	var Bubble = require('../../built/index.js');

// Import configuration
	var configuration = fs.readFileSync(path.join(__dirname, 'config/app.json'), 'utf-8');
	configuration = JSON.parse(configuration);

// Instance a Bubble
	var bubble = new Bubble(configuration);

// Enable logging
	bubble.enableLogging();

// Define databases
	bubble.run(require('./databases'));

// Define http-routes
	bubble.run(require('./http-routes'));

// Start server
	bubble.up();