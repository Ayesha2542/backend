const customReferences = require('./references/customReferences');
require('./database/config');
require('./controllers/Auth/CustomerAuthController');
require('./controllers/Auth/adminAuthController');
require('./controllers/Auth/subAdminController');

customReferences.app.listen(8888);
