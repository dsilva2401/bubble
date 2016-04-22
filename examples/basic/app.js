// Import Bubble
	var Bubble = require('../../built/index.js');

// Instance a Bubble
	var bubble = new Bubble({
		domain: 'localhost',
		http: { port: 3000 },
		https: { port: 5000 },
	});

// Enable logging
	bubble.enableLogging();

// Define routes
	bubble.run(function ($app) {
		$app.get('/', function (req, res, next) {
			res.end(':D');
		});
	});

// Start server
	bubble.up();