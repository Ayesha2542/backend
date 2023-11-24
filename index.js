const customReferences = require('./references/customReferences');
require('./database/config');
require('./controllers/Auth/CustomerAuthController');
require('./controllers/Auth/adminAuthController');
require('./controllers/CategoriesController');
require('./controllers/Auth/subAdminController');
require('./controllers/Auth/RestaurantAuthController');

customReferences.app.listen(8888);
