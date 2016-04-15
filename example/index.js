// Imports
var Bubble = require('../built/index.js');

// Instance a Bubble
var bubble = new Bubble({
	domain: 'localhost',
	http: { port: 3000 },
	https: { port: 5000 },
});
// var bubbleSon = new Bubble();

bubble.enableLogging();

// Define routes
bubble.run(function ($app) {
	$app.get('/', function (req, res, next) {
		res.end(':D');
	});
});

/*bubbleSon.run(function ($app) {
	$app.get('/', function (req, res, next) {
		res.end('App 1');
	})
});

bubble.install('test', bubbleSon);*/

bubble.up();