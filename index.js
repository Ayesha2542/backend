const customReferences = require('./references/customReferences');
require('./database/config');
require('./controllers/Auth/CustomerAuthController');
require('./controllers/Auth/adminAuthController');
customReferences.app.listen(8888);
