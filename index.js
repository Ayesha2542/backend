const customReferences = require('./references/customReferences');
require('./database/config');
require('./controllers/Auth/CustomerAuthController');

customReferences.app.listen(8888);
