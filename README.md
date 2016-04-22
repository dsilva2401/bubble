Bubble
======

An express framework wrapper

### Installation
```bash
npm install express-bubble --save
```

### Attributtes
- **logger**: `Function` - (*optional*) A function used to log in console.
- **config**: `Object` - An object with app configuration.
- **app**: `express` - An `Express` instance.
- **databases**: `Object` - App databases.
- **childs**: `Object` - App `Bubble` childs.
- **interfaces**: `Object` - App interfaces.
- **agents**: `Object` - App agents.
- **transporters**: `Object` - App transporters.

### Constructor
- *new* `Bubble`(***config***: `Object`, ***parentBubble*** (*optional*): `Bubble` ) - Creates a new instance of `Bubble` getting ***config*** with app configuration and an optional parameter ***parentBubble*** with an instance of the parent bubble if is the child bubble.

#### Config parameter attributes

| Config attribute | Type | Description |
| --- | --- | --- |
| `config.domain` | `String` | Sets app domain |
| `config.http.port`| `Number` | Sets app http port |
| `config.https.port`| `Number` | Sets app https port |

### Methods 
- **enableLogging**( ***logger*** (*optional*): `Function` ) - Enable logging using `logger` if passed.
- **run**( ***fn***: `Function` ) - Execute and inject dependencies to `fn`.
- **install**( ***name***: `String`, ***bubble***: `Bubble`  ) - Append bubble app.
- **up**() - Start serving (only available if current app is *root*).

### Available dependencies
- `$app` - `express` instance.
- `$config`- App configuration.
- `$databases` - App databases.
- `$libs` - External modules.
- `$logger` - Logger function.
- `$express` - `express` framework.
- `$interfaces` - App interfaces.
- `$agents` - App agents.
- `$transporters` - App transporters.
- `$q` - `Q` promises library.
- `$parent` - parent `Bubble` instance.

### Example
```javascript
var Bubble = require('express-bubble');

var bubble = new Bubble({
	domain: 'localhost:3000',
	http: { port: 3000 },
	https: { port: 5000 }
});

bubble.run(function ($app) {
	$app.get(req, res, next) {
		res.send('Hello World!');
		res.end();
	}
});

bubble.up();
```

### Other examples
- [https://github.com/dsilva2401/goldfish](https://github.com/dsilva2401/goldfish)