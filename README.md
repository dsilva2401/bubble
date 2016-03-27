Bubble
======

An express framework wrapper

### Attributtes
- **logger**: `Function` - (*optional*) A function used to log in console.
- **config**: `Object` - An object with app configuration.
- **app**: `express` - An `Express` instance.
- **databases**: `Object` - App databases.
- **childs**: `Object` - App `Bubble` childs.
- **interfaces**: `Object` - App interfaces.

### Constructor
- *new* `Bubble`(***config***: `Object`, ***isRoot*** (*optional*): `Boolean` ) - Creates a new instance of `Bubble` getting ***config*** with app configuration and an optional parameter caller ***isRoot*** set to `true` if instance is *root* app.

#### Config parameter attributes

| Config attribute | Type | Description |
| --- | --- | --- |
| `config.domain` | `String` | Sets app domain |
| `config.port`| `Number` | Sets app port |

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
- `$q` - `Q` promises librarie.

### Example usage
```javascript
var Bubble = require('bubble');

var bubble = new Bubble({
	domain: 'localhost',
	port: 3000
});

bubble.run(function ($app) {
	$app.get(req, res, next) {
		res.send('Hello World!');
		res.end();
	}
});

bubble.up();
```