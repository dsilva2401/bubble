module.exports = function ($express, $app) {
	
	// Define Router
		var appRouter = $express.Router();

	// Define routes
		appRouter.get('/', function (req, res) {
			res.send(':D');
			res.end();
		});

	// Append router to app
		$app.use('/', appRouter);
}