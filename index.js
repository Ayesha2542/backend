const customReferences = require('./references/customReferences');
require('./database/config');
require('./controllers/Auth/AuthController');

customReferences.app.listen(8888);
